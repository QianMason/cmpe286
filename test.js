const {NodeSSH} = require('node-ssh')
const ssh = new NodeSSH()

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
    console.log("inside here");
    ssh.execCommand('python motor.py', { cwd:'/home/pi/Documents/' }).then(function(result) {
        
        // response.writeHead(200);
        // response.write('hello');
        
        // response.end();
    }).catch(() =>{
      console.log(error);
        // response.writeHead(404);
        // response.write('goodbye');
        // response.end();
    }
    )
    console.log("after exec");
    
    // With streaming stdout/stderr callbacks
  }).catch(() => {
    // response.writeHead(500);
    // response.write("Bad");
    // response.end();
  })