const express = require('express');
const app = express();
const request = require('request');
const csv = require('csvtojson');
const router = express.Router();
const fs = require('fs');

router.get('/',(req,res) => {
  res.sendFile(__dirname + '/index.html');
});

router.get('/convert/csv/to/json',(req,res) => {
  if(req.query.q === undefined || req.query.q === null || req.query.q === '') {
    return res.json({error: true,message: 'No file provided!'});
  }
  request(req.query.q,(error,response,body) => {
    if(error) {
      return res.json({error: true,message: 'Error occurred reading CSV file!'});
    }
    let jsonData = [];
    csv()
      .fromString(response.body)
      .on('json',(data) => {
        console.log(data);
        jsonData.push(data);
      })
      .on('done',() => {
        res.json({error: false,message: "Success", data: jsonData});
      });
  });
});

app.use(express.static('js'));
app.use('/',router);

app.listen(80,() => {
  console.log("Listening to Port 80");
});
