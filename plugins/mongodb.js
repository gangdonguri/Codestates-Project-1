'use strict'

const fp = require('fastify-plugin')

const mongodb = require('@fastify/mongodb')

module.exports = fp(async function (fastify, opts) {
  
  fastify.register(mongodb, {
    forceClose: true,
    url: process.env.CONNECTION_STRING
  } )
  
  console.log('mongobd 플러그인 등록 성공')
})
