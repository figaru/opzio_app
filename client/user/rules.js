//Deny any update to a user from the client side
Meteor.users.deny({
	update() { return true; }
});