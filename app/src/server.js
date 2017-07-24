var express = require('express');
var app = express();

app.use(express.static(__dirname + '/ui'));

//your routes here
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/ui/index.html");
});

app.use(function(req, res){
  res.send(404);
});

app.listen(8080, function () {
  console.log('Server listening on port 8080!');
});
