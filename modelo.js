var db = require('knex')({
//  debug: true,
  client: 'pg',
  connection:{host:"localhost",user:"test",password:"test",database:"test"},
  searchPath: 'public'
});

// Sólo crea las tabla si no existen e inserta datos si están vacias

db.schema.createTableIfNotExists('todos', function(table) {
  // ESTRUCTURA DE LA TABLA
  table.increments('id');
  table.string('text');
  table.boolean('complete');
  table.timestamp('created');
  table.timestamp('updated');
  //
})
.then(function(){
  return db('todos').select().count().then(function(r){
    if (r[0].count==0) {
      console.log("tabla todos vacia, insertamos datos predefinidos.");
      return db('todos').insert([
        // DATOS PREDEFINIDOS
        {text:"inserción automática 1", complete:true, created:new Date()},
        {text:"inserción automática 2", complete:true, created:new Date()},
        //
      ]);
    }
    else {
      return console.log("La tabla todos no está vacia: conservamos los datos.")
    }
  });
});

db.schema.createTableIfNotExists('modulos',function(table){
  table.increments('id').primary();
  table.string('nombre'); // ficha que hace referencia
  table.string('ficha'); // modelo de la DB hace referencia
  table.string('model'); // modelo de la DB hace referencia
})
.then(function(){
  return db("modulos").select().count().then(function(r){
    if (r[0].count==0) {
      console.log("tabla modulos vacia, insertamos datos predefinidos");
      return db("modulos").insert([
        {nombre:"Ficha de Fichas", ficha:"fichaFichas",    model:"campos"},
        {nombre:"Todos"          , ficha:"fichaTodos" ,    model:"todos"},
        {nombre:"Personas",        ficha:"fichaPersonas",  model:"personas"},
        {nombre:"Entidades",       ficha:"fichaEntidades", model:"entidades"},
        {nombre:"Eventos",         ficha:"fichaEventos",   model:"eventos"},
      ]);
    }
    else {
      return console.log("La tabla modulos no está vacia: conservamos los datos.");
    }
  });
});


db.schema.createTableIfNotExists('campos',function(table){
  table.increments('id').primary();
  table.string('ficha'); // ficha que hace referencia
  table.string('model').index(); // modelo de la DB hace referencia
  table.string('orden'); // orden en el que aparece
  table.string('posic'); // posicion dentro de la view
  table.string('campo'); // campo de la base de datos 
  table.string('etiqu'); // label
  table.string('clase'); // tipo de input del formulario
  table.boolean('enlista'); // tipo de input del formulario
})
.then(function(){
  return db("campos").select().count().then(function(r){
    if (r[0].count==0) {
      console.log("tabla campos vacia, insertamos datos predefinidos");
      return db("campos").insert([
        {ficha:'fichaFichas',   model:'Campos',   orden:'01', posic:'m12', campo:'id',         etiqu:'ID',        clase:'caja',     enlista:0},
        {ficha:'fichaFichas',   model:'Campos',   orden:'02', posic:'m12', campo:'ficha',      etiqu:'Ficha',     clase:'caja',     enlista:1},
        {ficha:'fichaFichas',   model:'Campos',   orden:'03', posic:'m12', campo:'model',      etiqu:'Modelo',    clase:'caja',     enlista:0},
        {ficha:'fichaFichas',   model:'Campos',   orden:'04', posic:'m12', campo:'orden',      etiqu:'Orden',     clase:'caja',     enlista:0},
        {ficha:'fichaFichas',   model:'Campos',   orden:'05', posic:'m12', campo:'posic',      etiqu:'Posición',  clase:'caja',     enlista:0},
        {ficha:'fichaFichas',   model:'Campos',   orden:'06', posic:'m12', campo:'campo',      etiqu:'Campo',     clase:'caja',     enlista:0},
        {ficha:'fichaFichas',   model:'Campos',   orden:'07', posic:'m12', campo:'etiqu',      etiqu:'Etiqueta',  clase:'caja',     enlista:0},
        {ficha:'fichaFichas',   model:'Campos',   orden:'08', posic:'m12', campo:'clase',      etiqu:'Clase',     clase:'combobox', enlista:0},
        {ficha:'fichaPersonas', model:'Personas', orden:'01', posic:'m12', campo:'nombre',     etiqu:'Nombre',    clase:'cajaLista',enlista:1},
        {ficha:'fichaPersonas', model:'Personas', orden:'02', posic:'m12', campo:'apellidos',  etiqu:'Apellidos', clase:'caja',     enlista:1},
        {ficha:'fichaPersonas', model:'Personas', orden:'03', posic:'m12', campo:'nip',        etiqu:'NIP',       clase:'caja',     enlista:0},
        {ficha:'fichaTodos',    model:'Todos',    orden:'01', posic:'',    campo:'',           etiqu:'input',     clase:'checkbox', enlista:0},
        {ficha:'fichaTodos',    model:'Todos',    orden:'01', posic:'',    campo:'',           etiqu:'label',     clase:'',         enlista:0},
        {ficha:'fichaTodos',    model:'Todos',    orden:'01', posic:'',    campo:'',           etiqu:'a',         clase:'delete',   enlista:0},
      ]);
    }
    else {
      return console.log("La tabla Campos no está vacia: conservamos los datos.");
    }
  });
});

db.schema.createTableIfNotExists('vista',function(table){
  table.increments('id').primary();
  table.string('model'); // modelo de la DB hace referencia
  table.string('orden'); // orden en el que aparece
  table.string('tag'); // tag
  table.string('campo'); // campo de la base de datos 
  table.string('clases'); // clases que se le asocia. Automaticamente el id de esta tabla tambien.
  table.boolean('enlista'); // tipo de input del formulario
})
.then(function(){
  return db("vista").select().count().then(function(r){
    if (r[0].count==0) {
      console.log("tabla vista vacia, insertamos datos predefinidos");
      return db("vista").insert([
        {model:'todos', orden:'1', tag:'input checkbox', campo:'complete',clases:null,     enlista:1},
        {model:'todos', orden:'2', tag:'label'         , campo:'text',    clases:null,     enlista:1},
        {model:'todos', orden:'3', tag:'a'             , campo:'',        clases:'delete', enlista:1},
      ]);
    }
    else {
      return console.log("La tabla vista no está vacia: conservamos los datos.");
    }
  });
});


// Sólo crea la tabla si no existe
db.schema.createTableIfNotExists('personas',function(table){
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
  table.date('u_modif_id').references('id');
})
.then(function(){
  return db("personas").select().count().then(function(r){
    if (r[0].count==0) {
      console.log("tabla personas vacia: insertamos datos predefinidos");
      return db("personas").insert([
        {nombre:'Adonay', apellidos:'Sanz'},
        {nombre:'Bruno',  apellidos:'Maltrás'}
      ]);
    }
    else {
      return console.log("La tabla Personas no está vacia: conservamos los datos.");
    }
  });
});


module.exports = db;
