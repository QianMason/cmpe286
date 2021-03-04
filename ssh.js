var http = require('http')
const {NodeSSH} = require('node-ssh')
const ssh = new NodeSSH()
var httpserver = http.createServer(function(request, response){
	ssh.connect({
        host: 'localhost',
        username: 'steel',
        privateKey: '/home/steel/.ssh/id_rsa'
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
        ssh.execCommand('python motor.py', { cwd:'/documents/' }).then(function(result) {
            
            response.writeHead(200);
            response.write('hello');
            
			      response.end();
        }).catch(() =>{
            response.writeHead(404);
            response.write('goodbye');
			      response.end();
        }
        )
        
        // With streaming stdout/stderr callbacks
      }).catch(() => {
        response.writeHead(500);
        response.write("Bad");
        response.end();
      })
}).listen(8083);