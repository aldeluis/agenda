const feathers = require('feathers');
const rest = require('feathers-rest');
const handler = require('feathers-errors/handler');
const socketio = require('feathers-socketio');
const service = require('feathers-knex');
const db = require('./modelo.js');
const util = require('util');
const hooks = require('feathers-hooks');

// Create a feathers instance.
var app = feathers()
  // Habilitamos la REST API
  .configure(rest())
  // Setup the public folder
  .use(feathers.static(__dirname+'/public'))
  // Enable Socket.io
  .configure(socketio())
  .configure(hooks())

// Connect to the db, create and register a Feathers service.
app.use('/todos', service({Model: db, name: 'todos'}));
app.use('/campos', service({Model: db, name: 'campos'}));
app.use('/secciones', service({Model: db, name: 'modulos'}));

//// Hook con desactivación de trasporte
//app.service('vista').before({
//  all: hooks.disable('socketio')
//});

// Hook con desactivación de método en un transporte
//app.service('vista').before({
//  get: hooks.disable()
//});

// Hook con log
//app.service('vista').before({
//  find:[console.log("hook!")]
//});

// Hook con log externo
//let mihook = function (options) {
//  return function(hook) {
//    console.log(util.inspect(hook))
//  }
//}
//
//app.service('vista').before({
//  find: [mihook()]
//})

// Hook con array de acciones
//app.service('vista').before({
//  find: function(){console.log("hola")}
//});

// Hook modificando el query 
//app.service('campos').before({
//  all: hooks.pluckQuery('model'),
//  get: [function(hook){
//    hook.params.query={model:"Todos"}
//  },
//  function(hook){console.log(hook.query)}]
//})

// Hooks before
app.service('todos').before({
  create(hook) {
    hook.data.created = new Date();
  },
  patch(hook) {
    hook.data.updated = new Date();
  }
});


// Hooks after
//app.service('campos').after({
//  find: function(hook) {
//    hook.result.forEach(function(row){
//      console.log(row.model);
//    });
//  }
//});

// Start the server
var port = 80;
app.listen(port, function() {
    console.log('Feathers server listening on port ' + port);
});

