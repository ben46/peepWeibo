var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var UserSchema = new Schema({
    screen_name: String 
    , uid: Number
    , guimiUids: []
});

exports.UserSchema = mongoose.model('UserSchema', UserSchema);



