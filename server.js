var feathers = require('feathers');
var handler = require('feathers-errors/handler');
var socketio = require('feathers-socketio');
var service = require('feathers-knex');
var db = require('./modelo.js')

// Create a feathers instance.
var app = feathers()
  // Setup the public folder
  .use(feathers.static(__dirname+'/public'))
  // Enable Socket.io
  .configure(socketio())

// Connect to the db, create and register a Feathers service.
app.use('/todos', service({Model: db, name: 'todos'}));

// Start the server
var port = 80;
app.listen(port, function() {
    console.log('Feathers server listening on port ' + port);
});

