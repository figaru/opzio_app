import { masonry } from 'meteor/sjors:meteor-masonry';

initMasonry = function(){
	Meteor.setTimeout(function(){
		$masonryEl = $('.grid').masonry({
			gutter: 0,
			itemSelector: '.msnry-item',
			columnWidth: '.grid-sizer',
			percentPosition: true
		});
	},500);
}

reloadMasonry = function(){
	$('.grid').masonry({
		itemSelector: '.msnry-item',
		//Use non-hidden width selector, otherwise will stack items in 1 column, from https://github.com/desandro/masonry/issues/429#issuecomment-80549765
		columnWidth: '.grid-sizer',
		percentPosition: true
	});
}

reloadInternalMasonry = function(){
	$('.internal-grid').masonry({
		itemSelector: '.internal-msnry-item',
		//Use non-hidden width selector, otherwise will stack items in 1 column, from https://github.com/desandro/masonry/issues/429#issuecomment-80549765
		columnWidth: '.internal-grid-sizer',
		percentPosition: true
	});
}