//Handles positioning the page at the right place for side navigation
$(document).on('click', '#sideNav .nav-link', function(e){
	e.preventDefault();
	let href = $(e.currentTarget).attr('href');
	try{		
		let pos = $(href).offset().top - 75;
		$('body').scrollTop(pos);
	}
	catch(err){
		console.log('undefined anchro for body scroll')
	}
});