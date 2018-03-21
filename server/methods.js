Meteor.methods({
	'removeUsers': function(){
		console.log('remove users by ' + this.userId)
		//Meteor.users.remove({});
	},
	'getImage': function(){
		try{
			return Images.findOne().image;
		}
		catch(err){
			return '';
		}
	}
});