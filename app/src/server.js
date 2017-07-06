var express = require('express');
var app = express();

app.use(express.static(__dirname + '/ui'));

//your routes here
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/ui/index.html");
});

app.get('/login', function(req, res){
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Login Page');
})

app.listen(8080, function () {
  console.log('Server listening on port 8080!');
});
