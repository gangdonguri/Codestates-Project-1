'use strict'

const fp = require('fastify-plugin')

const mongodb = require('@fastify/mongodb')

module.exports = fp(async function (fastify, opts) {
  
  fastify.register(mongodb, {
    forceClose: true,
    url: 'mongodb+srv://youngjun:73ZjlgwnM1GB3Uia@cluster0.sjrpyqv.mongodb.net/vote?retryWrites=true&w=majority'
  } )
  
  console.log('mongobd 플러그인 등록 성공')
})
