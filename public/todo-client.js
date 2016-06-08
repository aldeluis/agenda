var socket = io();
var app = feathers().configure(feathers.socketio(socket));
var todos = app.service('todos');
var campos = app.service('campos');

var laststate = null;
// monitor de conexión con el color del header
window.setInterval(function(){
  if (!socket.disconnected) {
    if (laststate == "red") {todos.find(function(error,todos){todos.forEach(addTodo)})}
    laststate = "green";
    $("#cabecera").css("color","green");
    }
  else {
    laststate = "red";
    $("#cabecera").css("color","red");
    $(".")
    }
  },500);

// TODOS
var contenedorTodos  = $('#todos');

function getTodoElement(todo) {
  return contenedorTodos.find('[data-id="'+todo.id+'"]')
}

function removeTodo(todo) {
 getTodoElement(todo).remove();
}

function addTodo(todo) {
 var html = '<li class="collection-item col s12 m12 dismissable" data-id="'+todo.id+'">'+
       '<input type="checkbox" id="checkbox'+todo.id+'" name="done">'+
       '<label for="checkbox'+todo.id+'">'+todo.text+'</label>'+
       '<a href="javascript://" class="delete"><span class="material-icons right">delete</span></a>'+
       '</li>';
 contenedorTodos.find('.todos').prepend(html);
 updateTodo(todo);
}

function updateTodo(todo) {
 var element = getTodoElement(todo);
 var checkbox = element.find('[name="done"]').removeAttr('disabled');
 element.toggleClass('done', todo.complete);
 checkbox.prop('checked', todo.complete);
}


todos.find(function(error, todos) {
  todos.forEach(addTodo);
});

todos.on('updated', updateTodo);
todos.on('removed', removeTodo);
todos.on('created', addTodo);

contenedorTodos.on('submit', 'form', function (ev) {
  if (laststate == "green") {
   var field = $(this).find('[name="text"]');

   todos.create({
     text: field.val(),
     complete: false
   });


   field.val('');
  }
  ev.preventDefault();

 });

 contenedorTodos.on('click', '.delete', function (ev) {
   var id = $(this).parents('li').data('id');
   todos.remove(id);
   ev.preventDefault();
 });

 contenedorTodos.on('click', '[name="done"]', function(ev) {
   var id = $(this).parents('li').data('id');
   $(this).attr('disabled', 'disabled');
   todos.update(id, {
     complete: $(this).is(':checked')
   });
 });

// CAMPOS
var contenedorCampos = $('#campos');

function getCampoElement(campo) {
  return contenedorCampos.find('[data-id="'+campo.id+'"]')
}

function removeCampo(campo) {
 getCampoElement(campo).remove();
}

function addCampo(campo) {
 var html = '<li class="collection-item col s12 m6" data-id="'+campo.id+'">'+
       '<label for="checkbox">'+campo.etiqu+'</label>'+
       '<input type="text"/>'+
       '</li>';
 contenedorCampos.find('.campos').append(html);
 updateCampo(campo);
}

function updateCampo(campo) {
 var element = getCampoElement(campo);
 var checkbox = element.find('[name="done"]').removeAttr('disabled');
 element.toggleClass('done', campo.complete);
 checkbox.prop('checked', campo.complete);
}

campos.on('updated', updateTodo);
campos.on('removed', removeTodo);
campos.on('created', addTodo);

campos.find(function(error, campos) {
  campos.forEach(addCampo);
});
