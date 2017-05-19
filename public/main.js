var itemList = $('.item-list');
var itemListTemplate = Handlebars.compile($("#item-list-template").html());

function renderList() {
  $.ajax('/items').done(function(fruits) {
    var context = {
      items: fruits
    };
    var itemListFilled = $(itemListTemplate(context));
    itemList.replaceWith(itemListFilled);
    itemList = itemListFilled;
  });
}

renderList();

$('.add-item').submit(function(event) {
  event.preventDefault();
  $.ajax({
    type: 'POST',
    url: '/items',
    data: {
      name: $(this).find('input').val()
    }
  }).done(function(response) {
    renderList();
    $('#input-value').val('');
  });
});

$('body').on('click', '.edit-item', function(event) {
  event.preventDefault();
  var item = $(event.target).parents('li');
  var display = item.children('.display');
  var form = item.children('form');
  var input = form.children('input');
  var name = display.children('.name');
  form.attr('hidden', null);
  input.focus();
  input.val(name.text());
  display.hide();
});

$('body').on('submit','.edit-item-form', function(event) {
  event.preventDefault();
  var input = $(event.target).children('input').val();
  var item = $(event.target).parents('li');
  var id = item.data('id');
  $.ajax({
    url: '/items/' + id,
    type: 'PUT',
    data: JSON.stringify({ name: input }),
    dataType: 'json',
    contentType: 'application/json'
  }).done(renderList);
});

$('body').on('click', '.delete-item', function(event){
  event.preventDefault();
  var item = $(event.target).parents('li');
  var id = item.data('id');//
  $.ajax({
    url: '/items/' + id,
    type: 'DELETE'
  }).done(renderList);
});

$('body').on('click', '.fa-check', function(event){
  event.preventDefault();
  
  var item = $(event.target).parents('li');
  var id = item.data('id');
  
  $.ajax({
    url: '/items/' + id,
    type: 'PUT',
    data: JSON.stringify({ complete: true }),
    dataType: 'json',
    contentType: 'application/json'
  }).done(renderList);
});