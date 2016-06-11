var feathers = require('feathers');
var rest = require('feathers-rest');
var bodyParser = require('body-parser');
var service = require('feathers-knex');
var socketio = require('feathers-socketio');
var db = require('./modelo.js')

var app = feathers()
  .use(feathers.static(__dirname+'/public'))
  .configure(rest())
  .configure(socketio())
  .configure(rest())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({extended: true}))

app.use('/todos', service({Model: db, name: 'todos'}));
app.use('/campos', service({Model: db, name: 'Campos'}));

var port = 80;
app.listen(port, function() {
    console.log('Feathers server listening on port ' + port);
});

