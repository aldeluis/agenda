var el = $('#todos');
var socket = io();
var app = feathers().configure(feathers.socketio(socket));
var todos = app.service('todos');


function getElement(todo) {
  return el.find('[data-id="'+todo.id+'"]')
}

function addTodo(todo) {
 var html = '<li class="collection-item dismissable" data-id="'+todo.id+'">'+
       '<input type="checkbox" id="checkbox'+todo.id+'" name="done">'+
			 '<label for="checkbox'+todo.id+'">'+todo.text+'</label>'+
       '<a href="javascript://" class="delete"><span class="material-icons right">delete</span></a>'+
       '</li>';

 el.find('.todos').prepend(html);
 updateTodo(todo);
}

function removeTodo(todo) {
 getElement(todo).remove();
}

function updateTodo(todo) {
 var element = getElement(todo);
 var checkbox = element.find('[name="done"]').removeAttr('disabled');

 element.toggleClass('done', todo.complete);
 checkbox.prop('checked', todo.complete);
}

todos.on('updated', updateTodo);
todos.on('removed', removeTodo);
todos.on('created', addTodo);

todos.find(function(error, todos) {
  todos.forEach(addTodo);
});

el.on('submit', 'form', function (ev) {
   var field = $(this).find('[name="text"]');

   todos.create({
     text: field.val(),
     complete: false
   });

   field.val('');
   ev.preventDefault();
 });

 el.on('click', '.delete', function (ev) {
   var id = $(this).parents('li').data('id');
   todos.remove(id);
   ev.preventDefault();
 });

 el.on('click', '[name="done"]', function(ev) {
   var id = $(this).parents('li').data('id');

   $(this).attr('disabled', 'disabled');

   todos.update(id, {
     complete: $(this).is(':checked')
   });
 });

