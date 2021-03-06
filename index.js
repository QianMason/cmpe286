const express = require('express');
const {NodeSSH} = require('node-ssh')
const ssh = new NodeSSH()
const app = express();
const PORT = 4000;
app.use(express.json());

// ssh.connect({
//   host: 'localhost',
//   username: 'steel',
//   privateKey: '/home/steel/.ssh/id_rsa'
// })
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
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log("post received");

    ssh.connect({
      host: 'proxy19.rt3.io',
      username: 'pi',
      password: 'admin',
      port: 38863
    })
    /*
     Or
     ssh.connect({
       host: 'localhost',
       username: 'steel',
       privateKey: fs.readFileSync('/home/steel/.ssh/id_rsa', 'utf8')
     })
     if you want to use the raw string as private key
     */
    .then(function() {
      // Local, Remote
      ssh.execCommand('python motor.py', { cwd:'/home/pi/Documents/' }).then(function(result) {
          
          // response.writeHead(200);
          // response.write('hello');
          
          // response.end();
      }).catch(() =>{
          // response.writeHead(404);
          // response.write('goodbye');
          // response.end();
      }
      )
      
      // With streaming stdout/stderr callbacks
    })

    res.send("Thank you.");
})

app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});

