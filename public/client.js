var socket = io();
var app = feathers()
  .configure(feathers.socketio(socket));

var todos = app.service('todos');
var vista = app.service('vista');
var campos = app.service('campos');
var secciones = app.service('secciones');

var laststate = null;
// monitor de conexión con el color del header
window.setInterval(function(){
  if (!socket.disconnected) {
    if (laststate == "red") {
      $('#innerContainer').empty();
      todos.find(function(error,todos){
        todos.forEach(addTodo)
      })
    $('input').removeAttr('disabled');
    $(".delete").unbind('click');
    $(".delete").css('color','');
    bucleReloj();
    }
  laststate = "green";
  $("#conexion").css("color","limegreen");
  }
  else {
    laststate = "red";
    $("#conexion").css("color","red");
    $('input').attr('disabled','disabled');
    $(".delete").click(function(e){e.stopPropagation();})
    $(".delete").css('color','grey');
    clearTimeout(bucleHora);
  }
},500);

// actualizador de timestamps
function actualizaHora() {
  $('#conexion').text(moment().format('LTS'));
}

function actualizaTimestamps() {
$('.Campos .campo2').each(function(i){
	  $(this).text(moment($(this).attr("data-time")).fromNow(true))
	})
}

var bucleHora;
function bucleReloj () {
  actualizaHora();
  actualizaTimestamps();
  bucleHora = setTimeout(bucleReloj, 1000);
}
bucleReloj();

// todos.create({id:1,text:"tarara"})
// todos.get({id:1})
// todos.remove({id:1})
// todos.patch(1,{complete:true})

//// SECCIONES ////
$( document ).ready(function(){$(".button-collapse").sideNav({closeonClick:true});});
secciones.on('created', addSeccion);
secciones.on('removed', removeSeccion);

function addSeccion(seccion) {
  $('#mobile').prepend(" <li><a data-id='"+seccion.id+"' class='botonera' href='#!'>"+seccion.nombre+"</a></li>");
  $('#desktop').prepend("<li><a data-id='"+seccion.id+"' class='botonera' href='#!'>"+seccion.nombre+"</a></li>");
}

function removeSeccion(seccion) {
  $('#mobile #'+seccion.id).remove();
  $('#desktop #'+seccion.id).remove();
}

// Rellena la botonera
secciones.find(function(error, secciones) {
  secciones.forEach(addSeccion);
});

// click en botonera
$('nav').on('click', '.botonera', function (ev) {
  $(this).parents().siblings().removeClass("active");
  $(this).parents().toggleClass("active");
  var id = $(this).data('id');
  $('#innerContainer').empty();
  // Rellena el contenedor
  secciones.get({id:id},function(err,res){console.log(res)});
  todos.find(function(error, todos) {
    todos.forEach(addTodo);
  });
  ev.preventDefault();
});

//// VISTA ////
vista.on('created', addCampo);
//vista.on('updates', updateCampo);
vista.on('removed', removeCampo);

function addCampo(campo) {
  
}

function addCampo(padres,campo) {
  var tags = campo.tag.split(" ");
  var campos = [];
  campos.push(document.createElement(tags[0]));
  var clases ="campo"+campo.id;
  campo.clases.split(" ").forEach(function(cl){clases=clases+" "+cl;});
  campos[0].className=clases;
  campos[0].textContent=campo.text;
  if (tags[0]=="input") {
    campos[0].type=tags[1];
    if (campos[1]=="checkbox") {
      var label = document.createElement("label");
      var acoplador=parseInt(Math.random()*1000000);
      campos[0].id=acoplador;
      label.htmlFor = acoplador;
      label.textContent = campo.text;
    }
    campos.push(label);
  }
  if (tags[0]=="a") {
    campos[0].href="#!";
  }

  console.log(campos);
  $(padres).prepend(campos);
}

function removeCampo(campo) {
 $('.campo'+campo.id).remove();
}
//// VISTA ////


//// TODOS ////

// eventos externos a los que responde nuestro controlador
todos.on('created', addTodo);
todos.on('updated', updateTodo);
todos.on('removed', removeTodo);
todos.on('patched', updateTodo);

function addTodo(todo) {
  var acoplador = parseInt(Math.random()*1000000);
  var e = $('<li class="Campos collection-item col s12 m12" data-id=0>'+
       '<input  id="'+acoplador+'" class="campo1" type="checkbox" name="done">'+
       '<label for="'+acoplador+'" class="campo2" ></label>'+
       '<div class="campo4"></div>'+
       '<a   class="campo3 delete" href="javascript://"><span class="material-icons right">delete</span></a>'+
       '</li>');
  e.attr('data-id',todo.id);
  $('#innerContainer').prepend(e);
  updateTodo(todo);
}

function updateTodo(todo) {
 $('[data-id='+todo.id+'] [name="done"]').removeAttr('disabled');
 $('[data-id='+todo.id+'] .campo1').toggleClass('done', todo.complete);
 $('[data-id='+todo.id+'] .campo1').prop('checked', todo.complete);
 $('[data-id='+todo.id+'] .campo4').text(todo.text);
 $('[data-id='+todo.id+'] .campo2').attr('data-time',todo.updated||todo.created);
// $('[data-id='+todo.id+'] .campo2').text(moment.from(moment(todo.updated||todo.created)).humanize());
 
}

function removeTodo(todo) {
 $('#innerContainer').find('[data-id='+todo.id+']').remove();
}

// envio de formulario
$('.container').on('submit', 'form', function (ev) {
// si no hay conexión, no hagas la petición
  if (laststate == "green") {
   var field = $(this).find('[name="text"]');
   todos.create({text: field.val(),complete: false});
   field.val('');
  }
  ev.preventDefault();
});

// click en borrar
$('#innerContainer').on('click', '.delete', function (ev) {
   var id = $(this).parents('li').data('id');
   todos.remove(id);
   ev.preventDefault();
});

// click en checkbox, deja desactivado el checkbox hasta respuesta
$('#innerContainer').on('click', '.campo1', function(ev) {
   var id = $(this).parents('li').data('id');
   $(this).attr('disabled', 'disabled');
   todos.patch(id,{complete: $(this).is(':checked')});
});
