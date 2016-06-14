var db = require('knex')({
  client: 'pg',
  connection:{host:"localhost",user:"test",password:"test",database:"test"},
  searchPath: 'public'
});

// Sólo crea la tabla si no existe
db.schema.createTableIfNotExists('todos',function(table) {
  table.increments('id');
  table.string('text');
  table.boolean('complete');
}).return();

// Sólo crea la tabla si no existe
db.schema.createTableIfNotExists('Modulos',function(table){
  table.increments('id').primary();
  table.string('nombre'); // ficha que hace referencia
  table.string('ficha'); // modelo de la DB hace referencia
  table.string('model'); // modelo de la DB hace referencia
}).return();

// Sólo inserta datos si no hay datos
db("Modulos").select().count().then(function(r){
  if (r[0].count==0) {return db("Modulos").insert([
    {nombre:"Ficha de Fichas", ficha:"fichaFichas",    model:"Campos"},
    {nombre:"Personas",        ficha:"fichaPersonas",  model:"Personas"},
    {nombre:"Entidades",       ficha:"fichaEntidades", model:"Entidades"},
    {nombre:"Eventos",         ficha:"fichaEventos",   model:"Eventos"}
  ])}});

// Sólo crea la tabla si no existe
db.schema.createTableIfNotExists('Campos',function(table){
  table.increments('id').primary();
  table.string('ficha'); // ficha que hace referencia
  table.string('model'); // modelo de la DB hace referencia
  table.string('orden'); // orden en el que aparece
  table.string('posic'); // posicion dentro de la view
  table.string('campo'); // campo de la base de datos 
  table.string('etiqu'); // label
  table.string('clase'); // tipo de input del formulario
  table.boolean('enlista'); // tipo de input del formulario
}).return();

// Sólo inserta datos si no hay datos
db("Campos").select().count().then(function(r){
  if (r[0].count==0) {return db("Campos").insert([
    {ficha:'fichaFichas',   model:'Campos',   orden:'01', posic:'m12', campo:'id',         etiqu:'ID',       clase:'caja',     enlista:0},
    {ficha:'fichaFichas',   model:'Campos',   orden:'02', posic:'m12', campo:'ficha',      etiqu:'Ficha',    clase:'caja',     enlista:1},
    {ficha:'fichaFichas',   model:'Campos',   orden:'03', posic:'m12', campo:'model',      etiqu:'Modelo',   clase:'caja',     enlista:0},
    {ficha:'fichaFichas',   model:'Campos',   orden:'04', posic:'m12', campo:'orden',      etiqu:'Orden',    clase:'caja',     enlista:0},
    {ficha:'fichaFichas',   model:'Campos',   orden:'05', posic:'m12', campo:'posic',      etiqu:'Posición', clase:'caja',     enlista:0},
    {ficha:'fichaFichas',   model:'Campos',   orden:'06', posic:'m12', campo:'campo',      etiqu:'Campo',    clase:'caja',     enlista:0},
    {ficha:'fichaFichas',   model:'Campos',   orden:'07', posic:'m12', campo:'etiqu',      etiqu:'Etiqueta', clase:'caja',     enlista:0},
    {ficha:'fichaFichas',   model:'Campos',   orden:'08', posic:'m12', campo:'clase',      etiqu:'Clase',    clase:'combobox', enlista:0},
    {ficha:'fichaPersonas', model:'Personas', orden:'01', posic:'m12', campo:'nombre',     etiqu:'Nombre',   clase:'cajaLista',enlista:1},
    {ficha:'fichaPersonas', model:'Personas', orden:'02', posic:'m12', campo:'apellidos',  etiqu:'Apellidos',clase:'caja',     enlista:1},
    {ficha:'fichaPersonas', model:'Personas', orden:'03', posic:'m12', campo:'nip',        etiqu:'NIP',      clase:'caja',     enlista:0}
  ])}});


// Sólo crea la tabla si no existe
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
});

// Sólo inserta datos si no hay datos
db("Personas").select().count().then(function(r){
  if (r[0].count==0) {return db("Personas").insert([
    {nombre:'Adonay', apellidos:'Sanz'},
    {nombre:'Bruno',  apellidos:'Maltrás'}
  ])}});

module.exports = db;
