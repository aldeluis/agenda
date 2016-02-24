var db = require('knex')({
	debug: true,
  client: 'postgresql',
  connection: {
    host     : '127.0.0.1',
    user     : 'knex',
    password : 'knex',
    database : 'knex',
  searchPath: 'public',
  }
});

//var sql = require('knex')({client:'pg'});

//console.log(db('table').select().returning('*').toString());
//console.log(
//sql.schema.createTableIfNotExists('personas2',function(t){
//	t.increments('uid').primary();
//}).toString()
//);

db.schema.createTableIfNotExists('PERSONAS',function(table){
	table.increments('id_persona').primary();
	table.string('denominacion');
	table.string('numero_docid');
	table.enum('tipo_docid',['DNI','NIF','CIF','pasaporte']);
	table.enum('tipo_pers',['persona','entidad','grupo']);
	table.date('f_inicio');
	table.date('f_final');
}).return();


db.schema.createTableIfNotExists('PERSxPERS',function(table){
	table.increments('id_persXpers').primary();
	table.integer('id_persona_A').references('uid').inTable('personas');
	table.integer('id_persona_B').references('uid').inTable('personas');
	table.enum('tipo_relacion',['contrato','plaza','adscripción','cargo']);
	table.string('relacion');
	table.date('f_inicio');
	table.date('f_final');
}).return();

db.schema.createTableIfNotExists('PERSoLOCALIZADORES',function(table){
	table.increments('id_localizador').primary();
	table.integer('id_persona').references('uid').inTable('personas');
	table.enum('tipo_localizador',['teléfono','email','fax','url-www','linkedin']);
	table.string('localizador');
	table.string('observaciones');
}).return();
