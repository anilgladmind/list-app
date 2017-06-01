var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	AutoIncrement = require('mongoose-sequence');
 
var UserSchema = new Schema(
	{
		_id: Number,
		name: { type: String, required: true },
		number: { type: Number, required: true },
		email: { type: String, unique: true},
		avatar: {type: String},
		created_at: Date,
		updated_at: Date
	},
	{ _id: false }
);
UserSchema.plugin(AutoIncrement);

// on every save, add the date
UserSchema.pre('save', function(next) {
  var $this=this;
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  $this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    $this.created_at = currentDate;
	
  next();
 
});	

module.exports = mongoose.model('user', UserSchema);
	
