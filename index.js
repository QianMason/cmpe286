const e = require('express');
var mysql = require('mysql');
const express = require('express');
const {NodeSSH} = require('node-ssh')
const ssh = new NodeSSH()
const app = express();
const PORT = 4000;
app.use(express.json());

var con = mysql.createConnection({
  host: "localhost",
  user: "thunderpurtz",
  password: "cmpe286"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE IF NOT EXISTS TIMESTAMP", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
  con.query("CREATE TABLE IF NOT EXISTS TIMESTAMPS (timestamp DATETIME)", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});

function calculateTime(time) {
  var startDate = new Date();
  // Do your operations
  var endDate;
  var hour = time.slice(0, 2);
  var minutes = time.slice(3, 5);
  var waitTime = 0;
  
  if (startDate.getHours() > parseInt(hour)) {
    endDate = new Date(startDate.getTime());
    endDate.setHours(hour);
    endDate.setMinutes(minutes);
    endDate.setDate(startDate.getDate()+1)
    return endDate - startDate;

  } else if (startDate.getHours() === parseInt(hour)) {
    if (startDate.getMinutes() > minutes) {
      var mili = 23*60*60*1000 + (60 - minutes)*60*1000;
      return mili; 
    } else if (startDate.getMinutes() < minutes) {
      var mili = (minutes - startDate.getMinutes())*60*1000;
      return mili
    } else {
      return 0;
    }
  } else {
    endDate = new Date(startDate.getTime());
    endDate.setHours(hour);
    endDate.setMinutes(minutes);
    return endDate - startDate;
  }
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// routes
app.get('/', (req, res) => {
  res.send('Hello World');
  console.log("get request")
})
.post('/', (req, res) => {
    console.log("post received");

    ssh.connect({
      host: 'proxy22.rt3.io',
      username: 'pi',
      password: 'admin',
      port: 33178
    })

    .then(function() {
      // Local, Remote
      var timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
      con.query("INSERT INTO TIMESTAMPS (timestamp) VALUES (?)", [timestamp], function (err, result) {
        if (err) throw err;
        console.log("row created");
      });
      ssh.execCommand('python motor.py', { cwd:'/home/pi/Documents/' }).then(function(result) {
        
      }).catch(() =>{
      })
      
      // With streaming stdout/stderr callbacks
    })

    res.send("Thank you.");
})
.post('/schedule', (req, res) => {
  console.log(req.body);
  //var timeout = calculateTime(req.body);
  var timeout = 3000;
  setTimeout(function() {
    // Local, Remote
    ssh.execCommand('python motor.py', { cwd:'/home/pi/Documents/' }).then(function(result) {});
    var timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    con.query("INSERT INTO TIMESTAMPS (timestamp) VALUES (?)", [timestamp], function (err, result) {
      if (err) throw err;
      console.log("row created");
    });
  }, timeout);
  res.send("received");
})

app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});

