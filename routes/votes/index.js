'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    
    const votes = this.mongo.db.collection('votes')
    
    const result = await votes.find({}).toArray()

    reply
     .code(200)
     .header('content-type', 'application/json')
     .send(result)
  })
}
