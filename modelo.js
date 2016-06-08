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

db.schema.createTableIfNotExists('Modulos',function(table){
  table.increments('id').primary();
  table.string('nombre'); // ficha que hace referencia
  table.string('ficha'); // modelo de la DB hace referencia
}).return();


db.schema.createTableIfNotExists('Campos',function(table){
  table.increments('id').primary();
  table.string('ficha'); // ficha que hace referencia
  table.string('model'); // modelo de la DB hace referencia
  table.string('orden'); // orden en el que aparece
  table.string('posic'); // posicion dentro de la view
  table.string('campo'); // campo de la base de datos 
  table.string('etiqu'); // label
  table.string('clase'); // tipo de input del formulario
}).return();


db.schema.createTableIfNotExists('Personas',function(table){
  table.increments('id').primary();
  table.string('nombre');
  table.string('apellidos');
  table.string('nip');
  table.enum('t_nip',['DNI','Pasaporte', 'NIE']);
  table.enum('sexo',['0', '1']);
  table.date('f_inicio');
  table.date('f_final');
  table.date('f_modif');
  table.date('f_creac');
  table.date('f_vigen');
  table.date('u_modif_id').references('id').inTable('Personas');
}).return();

module.exports = db;
