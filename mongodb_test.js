var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dblocation =  'mongodb://localhost/mongodb_test';

mongoose.connect(dblocation);

var UserSchema = new Schema({
    screen_name: String 
    , uid: Number
    , comments: []
});

mongoose.model('User', UserSchema)
User = mongoose.model('User');
// user = new User({
//   screen_name: 'ben'
//   , uid: 248
// })
// user.save()

User.findOne({screen_name:'ben'}, function (err, user) {

  console.log(user.screen_name);
  console.log(user.uid);


})

