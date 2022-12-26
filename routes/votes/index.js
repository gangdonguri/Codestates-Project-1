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

  // 생성된 투표 확인
  fastify.get('/:voteId', async function (request, reply) {
    
    const votes = this.mongo.db.collection('votes')
  
    const result = await votes.find({voteId:request.params.voteId}).toArray()

    if(result){
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
  
    const result = await ops.find({voteId:request.params.voteId}).toArray()
 
    if(result){
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
