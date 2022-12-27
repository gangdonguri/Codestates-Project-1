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
        await countCollection.insertOne(
          {
            "userId": request.body.userId,
            "optionName": request.params.optionId
          }
        )

        // TDOO 6. 삽입된 데이터 보여주기
        reply
          .code(200)
          .header('content-type', 'application/json')
          .send(
            {
              "userId": request.body.userId,
              "optionName": findOfOptionsCollection[0].name
            }
          )
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

  // 새로운 투표 생성
  fastify.post('/', async function (request, reply) {

    const result = await this.mongo.db.collection('votes').insertOne(request.body)

    reply
      .code(200)
      .header('content-type', 'application/json')
      .send(result)
  })

  fastify.post('/options/:voteId', async function (request, reply) {

    const result = await this.mongo.db.collection('options').insertOne({
      "name": request.body.name,
      "voteId": request.params.voteId
    })

    reply
      .code(200)
      .header('content-type', 'application/json')
      .send(result)
  })

  // 사용자는 자신이 생성한 투표를 삭제할 수 있다.
  fastify.delete('/:voteId', async function (request, reply) {

    const requestUserId = request.body.userId
    const todosCollection = this.mongo.db.collection('votes')
    const findOfVotes = await todosCollection.find({ voteId: Number(request.params.voteId) }).toArray()
    console.log(findOfVotes)

    if (findOfVotes.length === 0) {
      reply
        .code(404)
        .header('content-type', 'text/plain')
        .send('해당 사용자가 작성한 투표가 없습니다.')
    }
    else {
      if (requestUserId === findOfVotes[0].userId) {
        const result = await todosCollection.deleteOne({ voteId: Number(request.params.voteId) })
        if (result.deletedCount === 0) {
          reply
            .code(404)
            .header('content-type', 'text/plain')
            .send('404 Not Found')
        }
        else {
          reply
            .code(200)
            .header('content-type', 'application/json')
            .send({
              "status": "200 OK",
              "voteId": request.params.voteId,
              "voteTitle": findOfVotes[0].title
            })
        }
      }
      else {
        reply
          .code(403)
          .header('content-type', 'text/plain')
          .send('403 Forbidden')
      }
    }
  })
}
