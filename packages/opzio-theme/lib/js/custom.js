//Label manipulation for materialize style
_.each($('.form-group input'), function(e){

  if(typeof $(e).val() !== 'undefined'){
    if($(e).val().length > 0){
      $(e).closest('.form-group').toggleClass('focused');
    };
  };
});

$('.form-control, .selectize-input input').on('focus blur', function (e) {
  if(typeof this.value !== 'undefined'){
    $(this).closest('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0 || $(this).parent().hasClass('has-items')));
  }
}).trigger('blur');

$('button').click(function(e){
	//data-target="#exampleModal"
	console.log(e)
})