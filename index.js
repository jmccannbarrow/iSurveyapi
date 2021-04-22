const express = require('express');

const app = express();

const bodyParser = require('body-parser');


const exphbs = require('express-handlebars');

const mysql = require('mysql');

const fs = require('fs');
const path = require('path');
const { request } = require('http');



//app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json())



//Create connection

const conn = mysql.createConnection({

  host: 'localhost',

  user: 'root',

  password: 'root',

  database: 'isurvey'

});



//connect to database

conn.connect((err) => {

  if (err) throw err;

  console.log('Mysql Connected...');

});



//route for homepage

app.get('/', (req, res) => {

  res.send({ hello: 'world' });

});




      // User Surveys

      app.get('/usersurveys/:userid', (req, res) => {

        let sql = "select surveys.surveyname,   surveys.surveyid, surveys.surveydescription   from surveys inner join  users   inner join  usersurveys on surveys.surveyid = usersurveys.surveyid   and users.userid = usersurveys.userid where usersurveys.userid = " + req.params.userid + "";
             
        let query = conn.query(sql, (err, results) => {

          if (err) throw err;

          res.send({ surveys: results });

 
        });

      });

      app.get('/userquestions/:userid', (req, res) => {

          let sql = "select surveys.surveyid,  questions.questionid,  questions.questiondescription from surveys inner join users inner join usersurveys on surveys.surveyid = usersurveys.surveyid and users.userid = usersurveys.userid  inner join surveyquestions on surveys.surveyid = surveyquestions.surveyid inner join questions on surveyquestions.questionid = questions.questionid where usersurveys.userid = " + req.params.userid + ""; 
              
         let query = conn.query(sql, (err, results) => {
 
           if (err) throw err;
 
           res.send({ questions: results });
 
  
         });
 
       });


       app.post('/ReceiveJSON', function(req, res){
         console.log("Ive been called");
        console.log(req.body);
        
        
        //var jsondata = JSON.stringify(req.body);
        var jsondata = req.body;
        var values = [];
        //console.log(jsondata.length);
        //console.log(jsondata);
        
        for(var i=0; i< jsondata.length; i++)
        //console.log(jsondata.length)
         values.push([jsondata[i].questionid,jsondata[i].surveyid,jsondata[i].surveyinstanceid,jsondata[i].userid,jsondata[i].answer]);
         // values.push([jsondata[i].questionid]);
          //console.log(jsondata[i].questionid);
        
        //Bulk insert using nested array [ [a,b],[c,d] ] will be flattened to (a,b),(c,d)
        conn.query('INSERT INTO surveyinstances (questionid, surveyid, surveyinstanceid, userid, answer) VALUES ?', [values], function(err,result) {
          if(err) {
           console.log("error");
             res.send('Error');
          }
        
        }
        );

        

      /* let sql = 'INSERT INTO surveyinstances SET ?'
        let post = {
          questionid: req.body.questionid,
          surveyid : req.body.surveyid,
          surveyinstanceid: req.body.surveyinstanceid,
          userid: req.body.userid,
         answer: req.body.answer
        }
        conn.query(sql, post, (err, res) => {
            if(err) throw err;
            console.log('success');
            console.log(res);
        });

*/

       res.send("ok");
       });
 
  

        const port = 8000;

        app.listen(port);

        console.log(`Listening to server: http://localhost:${port}`);