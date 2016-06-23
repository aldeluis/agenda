var socket = io();
var app = feathers()
  .configure(feathers.socketio(socket));

var todos = app.service('todos');
var vista = app.service('vista');
var campos = app.service('campos');

var laststate = null;
// monitor de conexión con el color del header
window.setInterval(function(){
  if (!socket.disconnected) {
    if (laststate == "red") {
      $('#todos #innerContainer').empty();
      todos.find(function(error,todos){
        todos.forEach(addTodo)
      })
    $('input').removeAttr('disabled');
    $(".delete").unbind('click');
    $(".delete").css('color','');
    bucleReloj();
    }
  laststate = "green";
  $("#conexion").css("background-color","limegreen");
  }
  else {
    laststate = "red";
    $("#conexion").css("background-color","red");
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

// todos.add({id:1,text:"tarara"})
// todos.get({id:1})
// todos.remove({id:1})
// todos.patch(1,{complete:true})

// eventos externos a los que responde nuestro controlador
//todos.on('created', addTodo);
//todos.on('updated', updateTodo);
//todos.on('patched', updateTodo);
//todos.on('removed', removeTodo);

//// VISTA ////
vista.on('created', addCampo);
//vista.on('updates', updateCampo);
vista.on('removed', removeCampo);

function addCampo(campo) {
 var campoHtml = document.createElement(campo.html);
 campoHtml.className="campo"+campo.id;
 campoHtml.innerText="relleno";
 $('.innerCampos').append(campoHtml);
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
 var html = '<li class="Campos collection-item col s12 m12" data-id="'+todo.id+'">'+
       '<input id="checkbox'+todo.id+'"class="campo1" type="checkbox" name="done">'+
       '<label class="campo2" for="checkbox'+todo.id+'"></label>'+
       '<div class="campo4"></div>'+
       '<a   class="campo3 delete" href="javascript://"><span class="material-icons right">delete</span></a>'+
       '</li>';
 $('#innerContainer').prepend(html);
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

// Rellena el contenedor
todos.find(function(error, todos) {
  todos.forEach(addTodo);
});

