#!/bin/bash

curl --data '{ "userId": 1, "category": "연예", "title": "최애 연예인은?", "voteId": 1 }' -H "Content-Type: application/json" -X POST http://127.0.0.1:3000/votes
curl --data '{ "userId": 2, "category": "연예", "title": "최애 그룹은?", "voteId": 2 }' -H "Content-Type: application/json" -X POST http://127.0.0.1:3000/votes
curl --data '{ "userId": 3, "category": "연예", "title": "최애 맴버는?", "voteId": 3 }' -H "Content-Type: application/json" -X POST http://127.0.0.1:3000/votes
curl --data '{ "userId": 4, "category": "정치", "title": "지지정당은?", "voteId": 4 }' -H "Content-Type: application/json" -X POST http://127.0.0.1:3000/votes
curl --data '{ "userId": 5, "category": "라이프", "title": "최애 음식은?", "voteId": 5 }' -H "Content-Type: application/json" -X POST http://127.0.0.1:3000/votes
curl --data '{ "userId": 6, "category": "라이프", "title": "최애 운동은?", "voteId": 6 }' -H "Content-Type: application/json" -X POST http://127.0.0.1:3000/votes


