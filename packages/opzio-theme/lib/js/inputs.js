export const name = 'materialLabel';

MaterialLabel = function(){
	_.each($(".form-group input, .form-group input"),function(t){
	  "undefined"!=typeof $(t).val()&&$(t).val().length>0&&$(t).closest(".form-group").toggleClass("focused")
	})

	$(".form-control, .selectize-input input").on("focus blur",function(t){
	  "undefined"!=typeof this.value&&$(this).closest(".form-group").toggleClass("focused","focus"===t.type||this.value.length>0||$(this).parent().hasClass("has-items"))
	}).trigger("blur")
}