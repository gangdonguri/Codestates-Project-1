'use strict'
//모든 생성된 투표 확인
module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {

    const votes = this.mongo.db.collection('votes')

    const result = await votes.find({}).toArray()

    reply
      .code(200)
      .header('content-type', 'application/json')
      .send(result)
  })

  // 사용자는 선택지를 선택하여 투표할 수 있다.
  fastify.post('/count/:optionId', async function (request, reply) {

    // TODO 1. Request Body의 userId 프린트
    console.log('request_userID : ' + request.body.userId)

    // TODO 2. Request PATH의 optionId 프린트
    console.log('reuqest_optionId : ' + request.params.optionId)

    // TODO 3.1 MongoDB count collection 연결하기
    const countCollection = this.mongo.db.collection('count')

    // TDOO 3.2 MongoDB option collection 연결하기
    const optionCollection = this.mongo.db.collection('options')

    // TODO 4.1 이미 투표했을 경우 400 code return
    const findOfCountCollection = await countCollection.find({ userId: request.body.userId, optionId: request.params.optionId }).toArray()
    console.log(findOfCountCollection)

    if (findOfCountCollection.length !== 0) {
      reply
        .code(400)
        .header('content-type', 'text/plain')
        .send('이미 투표가 완료 되었습니다.')
    }
    else {
      // TODO 4.2 해당 선택지가 없을 경우 404 code return 
      const findOfOptionsCollection = await optionCollection.find({ optionId: request.params.optionId }).toArray()
      console.log(findOfOptionsCollection)
      if (findOfOptionsCollection.length === 0) {
        reply
          .code(404)
          .header('content-type', 'text/plain')
          .send('해당 선택지가 없습니다.')
      }
      else {
        // TODO 5. 위 조건문을 모두 통과했을 경우 Insert
        const insertResult = await countCollection.insertOne(
          {
            "userId": request.body.userId,
            "optionId": request.params.optionId
          }
        )

        // TDOO 6. 삽입된 데이터 보여주기
        if (insertResult) {
          reply
            .code(200)
            .header('content-type', 'application/json')
            .send(
              {
                "userId": request.body.userId,
                "optionId": request.params.optionId
              }
            )
        }
      }
    }

  })

  // 생성된 투표 확인
  fastify.get('/:voteId', async function (request, reply) {

    const votes = this.mongo.db.collection('votes')
    console.log(votes)

    const result = await votes.find({ voteId: request.params.voteId }).toArray()
    console.log(result)

    if (result) {
      reply
        .code(200)
        .header('content-type', 'application/json')
        .send(result)
    }
    else {
      reply
        .code(404)
        .header('content-type', 'text/plain')
        .send('Not Found')
    }
  })

  //생성된 투표에서 모든선택지 확인
  fastify.get('/options/:voteId', async function (request, reply) {

    const ops = this.mongo.db.collection('options')

    const result = await ops.find({ voteId: request.params.voteId }).toArray()

    if (result) {
      reply
        .code(200)
        .header('content-type', 'application/json')
        .send(result)
    }
    else {
      reply
        .code(404)
        .header('content-type', 'text/plain')
        .send('Not Found')
    }
  })

}
