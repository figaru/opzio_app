Template.svgGraphBar.onRendered(function(){
	var a = setInterval(function(){
	  
	  $(".graphbar-animated .bar-1").animate(
	        { y: 37.25 },
	        {
	            duration: 2000,
	            step: function(now) { $(this).attr("y", now); }
	        }).animate(
	        { y: 45.25 },
	        {
	            duration: 2500,
	            step: function(now) { $(this).attr("y", now); }
	        });
	   $(".graphbar-animated .bar-2").animate(
	        { y: 25.25 },
	        {
	            duration: 2500,
	            step: function(now) { $(this).attr("y", now); }
	        }).animate(
	        { y: 45.25 },
	        {
	            duration: 3000,
	            step: function(now) { $(this).attr("y", now); }
	        }).animate(
	        { y: 28.25 },
	        {
	            duration: 2000,
	            step: function(now) { $(this).attr("y", now); }
	        });
	   $(".graphbar-animated .bar-3").animate(
	        { y: 45.25 },
	        {
	            duration: 3000,
	            step: function(now) { $(this).attr("y", now); }
	        }).animate(
	        { y: 45.25 },
	        {
	            duration: 2500,
	            step: function(now) { $(this).attr("y", now); }
	        }).animate(
	        { y: 18.25 },
	        {
	            duration: 3000,
	            step: function(now) { $(this).attr("y", now); }
	        });
	}, 2000);

	a;
});