var socket = io();
var app = feathers()
  .configure(feathers.socketio(socket));
var todos = app.service('todos');

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
    }
  },500);

//// Closurización
//var DOMina = function(container){
//  return {
//    get: function(element) {
//      return container.find('[data-id="'+element.id+'"]');
//    },
//    add: function(element) {
//      var html = '<li class="collection-item col s12 m12 dismissable" data-id="'+element.id+'">'+
//        '<input type="checkbox" id="checkbox'+element.id+'" name="done">'+
//        '<label for="checkbox'+element.id+'">'+element.text+'</label>'+
//        '<a href="javascript://" class="delete"><span class="material-icons right">warning</span></a>'+
//        '</li>';
//      container.find('#innerContainer').prepend(html);
//      this.update(element);
//    },
//    remove: function(element) {
//      this.get(element).remove();
//    },
//    update: function(element) {
//      var node = this.get(element);
//      var checkbox = node.find('[name="done"]').removeAttr('disabled');
//      node.find("label").text(element.text);
//      node.toggleClass('done', element.complete);
//      checkbox.prop('checked', element.complete);
//    }
//  };
//};

// DOMina(contenedor).add({id:1,text:"tarara"})
// DOMina(contenedor).get({id:1})
// DOMina(contenedor).remove({id:1})
// DOMina(contenedor).update({id:1,complete:true})

// eventos externos a los que responde nuestro controlador
//todos.on('created', addTodo);
//todos.on('updated', updateTodo);
//todos.on('removed', removeTodo);

// eventos externos a los que responde nuestro controlador
todos.on('created', addTodo);
todos.on('updated', updateTodo);
todos.on('removed', removeTodo);

//// TODOS
function getTodoElement(todo) {
  return $('#todos').find('[data-id="'+todo.id+'"]')
}

function addTodo(todo) {
 var html = '<li class="collection-item col s12 m12 dismissable" data-id="'+todo.id+'">'+
       '<input type="checkbox" id="checkbox'+todo.id+'" name="done">'+
       '<label for="checkbox'+todo.id+'">'+todo.text+'</label>'+
       '<a href="javascript://" class="delete"><span class="material-icons right">delete</span></a>'+
       '</li>';
 $('#todos').find('.todos').prepend(html);
 updateTodo(todo);
}

function updateTodo(todo) {
 var element = getTodoElement(todo);
 var checkbox = element.find('[name="done"]').removeAttr('disabled');
 element.toggleClass('done', todo.complete);
 checkbox.prop('checked', todo.complete);
}

function removeTodo(todo) {
 getTodoElement(todo).remove();
}

// envio de formulario
$('#todos').on('submit', 'form', function (ev) {
// si no hay conexión, no hagas la petición
  if (laststate == "green") {
   var field = $(this).find('[name="text"]');
   todos.create({text: field.val(),complete: false});
   field.val('');
  }
  ev.preventDefault();
});

// click en borrar
$('#todos').on('click', '.delete', function (ev) {
   var id = $(this).parents('li').data('id');
   todos.remove(id);
   ev.preventDefault();
});

// click en checkbox
$('#todos').on('click', '[name="done"]', function(ev) {
   var id = $(this).parents('li').data('id');
   $(this).attr('disabled', 'disabled');
   todos.update(id,{complete: $(this).is(':checked')});
});

// Rellena el contenedor
todos.find(function(error, todos) {
  todos.forEach(addTodo);
});

