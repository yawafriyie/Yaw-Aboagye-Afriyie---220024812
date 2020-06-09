const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const path = require('path')
const mongoDB = require("./mongodb")

const router = require("./app")




router.get('/student', function(req, res){
    res.render('studentsRecord')
})

router.post('/student', function(req, res){
    
})

router.get("studentApi", function(req, res){
    res.send("api")
})




