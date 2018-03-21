getCategoryFromID = function(categoryId){
	var category = DomainCategories.findOne({_id: categoryId });
	if(typeof(category) !== 'undefined'){
	    return category.label;
	}
	else{
	    return 'Unknown';
	    //return projectID; //Use this to return OTHERS when project is private or is under X totalTime
	}
}