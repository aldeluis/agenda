var feathers = require('feathers');
var rest = require('feathers-rest');
var bodyParser = require('body-parser');
var service = require('feathers-knex');

var db = require('knex')({
	debug: true,
  client: 'pg',
	connection:{host:"localhost",user:"test",password:"test",database:"test"},
	searchPath: 'public',
});

// This drops and creates table every time
db.schema.dropTableIfExists('todos').then(function(rows){
  return db.schema.createTable('todos', function(table) {
    table.increments('id');
    table.string('text');
		table.boolean('complete');
  })}).return();

// Create a feathers instance.
var app = feathers()
  // Setup the public folder.
  .use(feathers.static(__dirname+'/public'))
	// Enable REST services
	.configure(rest())
  // Enable Socket.io
  .configure(feathers.socketio())
  // Enable REST services
  .configure(feathers.rest())
  // Turn on JSON parser for REST services
  .use(bodyParser.json())
  // Turn on URL-encoded parser for REST services
  .use(bodyParser.urlencoded({extended: true}))

// Connect to the db, create and register a Feathers service.
app.use('/todos', service({Model: db, name: 'todos'}));

// Start the server.
var port = 80;
app.listen(port, function() {
    console.log('Feathers server listening on port ' + port);
});

//var app = feathers();
//var todoService = require('./todos');

//Service = {
  //create: function(data, params, callback) {},			// POST   /
  //find: function(params, callback) {},							// GET    /
  //get: function(id, params, callback) {},						// GET    /id
  //update: function(id, data, params, callback) {},	// PUT    /id
  //patch: function(id, data, params, callback) {},		// PATCH  /id
  //remove: function(id, params, callback) {},				// DELETE /id
  //setup: function(app, path) {}
//}

