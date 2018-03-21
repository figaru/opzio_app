Template.elements.onRendered(function(){
	drawPage();

  $('#jumpTop').click(function(){
    $(document).scrollTop(0);
  });
	
  //Init inputs Javascript


	var singleSelectDemo = $('#singleSelectDemo').selectize({
		delimiter: ',',
    maxItems: 1,
		persist: false,
		create: true,
		options: [
	        {
	        	name: 'Albert Einstein',
				text: 'Albert Einstein',
				value: 1
	        },
	        {
	        	name: 'Nicola Tesla',
				text: 'Nicola Tesla',
				value: 2
	        },
	        {
	        	name: 'Thomas Edison',
				text: 'Thomas Edison',
				value: 3
	        },
	        {
	        	name: 'Nicolas Flamel',
				text: 'Nicolas Flamel',
				value: 4
	        },
         	{
	        	name: 'Niels Bohr',
				text: 'Niels Bohr',
				value: 5
	        },
	        {
	        	name: 'Werner Heisenberg',
				text: 'Werner Heisenberg',
				value: 6
	        }
	    ],
	});

	singleSelectDemo[0].selectize.addItem(2, true);

  var multipleSelectDemo = $('#multipleSelectDemo').selectize({
    delimiter: ',',
    plugins: ['remove_button'],
    persist: false,
    create: true,
    options: [
      {
        name: 'Albert Einstein',
        text: 'Albert Einstein',
        value: 1
      },
      {
        name: 'Nicola Tesla',
        text: 'Nicola Tesla',
        value: 2
      },
      {
        name: 'Thomas Edison',
        text: 'Thomas Edison',
        value: 3
      },
      {
        name: 'Nicolas Flamel',
        text: 'Nicolas Flamel',
        value: 4
      },
      {
        name: 'Niels Bohr',
        text: 'Niels Bohr',
        value: 5
      },
      {
        name: 'Werner Heisenberg',
        text: 'Werner Heisenberg',
        value: 6
      }
    ],
  });

  multipleSelectDemo[0].selectize.addItem(2, true)
  multipleSelectDemo[0].selectize.addItem(3, true)
});

Template.elements.events({
  'click #infoToastr': function(){
    callToast('info', 'This is an info toast body.', 'This is a title')
  },
  'click #successToastr': function(){
    callToast('success', 'This is an success toast body.', 'This is a title')
  },
  'click #warningToastr': function(){
    callToast('warning', 'This is an warning toast body.', 'This is a title')
  },
  'click #errorToastr': function(){
    callToast('error', 'This is an error toast body.', 'This is a title')
  },
})