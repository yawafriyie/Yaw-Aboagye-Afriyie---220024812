const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const path = require('path')

const mongoDB = require("./mongodb")
const studentMongo = require("./studentMongo")




const url = "mongodb://localhost:27017"
const dbName = "goodhealthDB"
const patientCollectionName = "patient"
const patientRecordAndPaymentCollectionName = "payment"
const adminCollection = "admin"






//use express middleware
const app = express()

app.use(bodyParser.json())

//static files
app.use(express.static(path.join(__dirname + "/public")))


//set up template engine
app.set('view engine', 'ejs')

//body parser for accessing contents of the post request
app.use(bodyParser.urlencoded({ extended: true}))



//get mongodb connection and create collections
mongoDB.connectDB(async (err) => {
    if (err) throw err
    // create collections db & collections
    const dbo = mongoDB.getDB()
    dbo.createCollection(patientCollectionName, function(err, result){
        if(err) throw err
        console.log("patient collection created")
        })
    dbo.createCollection(patientRecordAndPaymentCollectionName, function(err, result){
        if(err) throw err
        console.log("patient and payment collection created")
    })
    dbo.createCollection("admin", function(err, result){
      if(err) throw err
      const adminLogin = {username:"root", password:"root"}
      dbo.collection("admin").insertOne(adminLogin, function(err, res) {
        if (err) throw err;
        console.log("1 patient document inserted");
      console.log("admin created")
  })
})
})


//routes

//get admin login
app.get('/', function(req, res){
    res.render('index')
    
})

app.get('/dashboard', function(req, res){
    res.render('dashboard')
    
})

app.get('/patientForm', function(req, res){
    res.render('patientForm')
})

app.get('/viewPatients', function(req, res){
    res.render('viewPatients')
})

app.get('/paymentForm', function(req, res){
    res.render('paymentForm')
})


app.get('/editPayment', function(req, res){
    res.render('editPayments')
})

app.get('/editPatients', function(req, res){
    res.render('editPatients')
})

app.get('/addPatients', function(req, res){
    res.render('addPatients')
})

app.get('/deletePatients', function(req, res){
    res.render('deletePatients')
})

app.get('/editPayments', function(req, res){
    res.render('editPayments')
})

app.get('/deletePayments', function(req, res){
    res.render('deletePayments')
})

app.get('/managePayments', function(req, res){
    res.render('managePayment')
})


app.post('/addPatients', function(req, res){
    var data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        contact: req.body.contact,
        DOB: req.body.dob,
        emergency: req.body.emergency,
        address: req.body.address
      }
    console.log(data)

    mongoDB.connectDB(async (err) => {
      if (err) throw err
      // create collections db & collections
      const dbo = mongoDB.getDB()
      dbo.collection(patientCollectionName).insertOne(data, function(err, res) {
          if (err) throw err;
          console.log("1 patient document inserted");
          
        });
      res.render('addPatients')
  })
})

app.post('/editPatients', function(req, res){
    var data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        contact: req.body.contact,
        DOB: req.body.dob,
        emergency: req.body.emergency,
        address: req.body.address
      }
    console.log(data)


      mongoDB.connectDB(async (err) => {
        if (err) throw err
        const dbo = mongoDB.getDB()
        var query = {lastname: req.body.lastname}
        var newvalues = { $set: data };
        dbo.collection(patientCollectionName).updateOne(query, newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 patient document updated");
            
          });
        res.render('editPatients')
    })

  })


app.post('/deletePatients', function(req, res){
        mongoDB.connectDB(async (err) => {
          if (err) throw err
          // create collections db & collections
          const dbo = mongoDB.getDB()
          const deleteQuery = {lastname: req.body.lastname}
          dbo.collection(patientCollectionName).deleteOne(deleteQuery, function(err, res) {
              if (err) throw err;
              console.log("1 patient document deleted");
              
            });
          res.render('deletePatients')
      })
      
    })
    



app.post('/', function(req, res){
    res.render('dashboard')
})

app.post('/editPayments', function(req, res){
      var data = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          paymentDate: req.body.paymentDate,
          amount: req.body.amount,
          balance: req.body.balance,
        }
      console.log(data)

      mongoDB.connectDB(async (err) => {
        if (err) throw err
        const dbo = mongoDB.getDB()
        var query = {lastname: req.body.lastname}
        var newvalues = { $set: data };
        dbo.collection(patientRecordAndPaymentCollectionName).updateOne(query, newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 payment document updated");
            
          });
        res.render('editPayments')
    })
      
      
})









//handle admin login
app.post('/login', function(req, res){
    mongoDB.connectDB(async (err) => {
        if (err) throw err
        // validate admin

        var query = { name: req.body.username}
        const dbo = mongoDB.getDB()
        var query = { username: req.body.username };
        dbo.collection(adminCollection).find(query).toArray(function(err, result) {
            if (err) throw err;
            //console.log(result);
            
            console.log(result[0].password)
            if(result[0].password === req.body.password && result[0].username === req.body.username) {
                res.render('dashboard')
            }
            else{
                res.render('incorrect')
            }
            
        });
            
            
            
          });
    })



    app.post('/editPayment', function(req, res){
        var data = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            contact: req.body.contact,
            DOB: req.body.dob,
            emergency: req.body.emergency,
            address: req.body.address
          }
        console.log(data)
  
        mongoDB.connectDB(async (err) => {
          if (err) throw err
          const dbo = mongoDB.getDB()
          dbo.collection(patientCollectionName).insertOne(data, function(err, res) {
              if (err) throw err;
              console.log("1 patient document inserted");
              
            });
          res.render('addPatients')
      })
        
        
  })


  app.post('/deletePayments', function(req, res){
    mongoDB.connectDB(async (err) => {
      if (err) throw err
      // create collections db & collections
      const dbo = mongoDB.getDB()
      const deleteQuery = {lastname: req.body.lastname}
      dbo.collection(patientRecordAndPaymentCollectionName).deleteOne(deleteQuery, function(err, res) {
          if (err) throw err;
          console.log("1 payment document deleted");
          
        });
      res.render('deletePayments')
  })
  
})

app.post('/paymentForm', function(req, res){
    var data = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            contact: req.body.contact,
            DOB: req.body.dob,
            emergency: req.body.emergency,
            address: req.body.address
      }
    console.log(data)

    mongoDB.connectDB(async (err) => {
      if (err) throw err
      // create collections db & collections
      const dbo = mongoDB.getDB()
      dbo.collection(patientRecordAndPaymentCollectionName).insertOne(data, function(err, res) {
          if (err) throw err;
          console.log("1 payment document inserted");
          
        });
      res.render('paymentForm')
  })
})

app.get('/student', function(req, res){
    res.render('addStudents')
})

app.get('/deleteStudents', function(req, res){
    res.render('deleteStudents')
})

app.get('/updateStudents', function(req, res){
    res.render('updateStudents')
})

app.get('/allStudents', function(req, res){
    res.render('allStudents')
})
  
app.post('/students', function(req, res){
    var data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        contact: req.body.contact,
        DOB: req.body.dob,
        
      }
    console.log(data)

    studentMongo.connectDB(async (err) => {
      if (err) throw err
      // create collections db & collections
      const dbo = mongoDB.getDB()
      dbo.collection("studenRecords").insertOne(data, function(err, res) {
          if (err) throw err;
          console.log("1 patient document inserted");
          
        });
      res.render('students')
  })
})


app.post('/editStudents', function(req, res){
    var data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        contact: req.body.contact,
        DOB: req.body.dob,
      }
    console.log(data)

    mongoDB.connectDB(async (err) => {
      if (err) throw err
      const dbo = mongoDB.getDB()
      dbo.collection("studentRecords").insertOne(data, function(err, res) {
          if (err) throw err;
          console.log("1 student document inserted");
          
        });
      res.render('editStudents')
  })
})

app.post('/deleteStudents', function(req, res){
    mongoDB.connectDB(async (err) => {
      if (err) throw err
      // create collections db & collections
      const dbo = mongoDB.getDB()
      const deleteQuery = {lastname: req.body.lastname}
      dbo.collection("studentRecords").deleteOne(deleteQuery, function(err, res) {
          if (err) throw err;
          console.log("1 student document deleted");
          
        });
      res.render('deleteStudents')
  })
  
})


app.listen(3000, () => {
    console.log("server is running on port 3000")
})


module.exports = app