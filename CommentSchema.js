
var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var CommentSchema = new Schema({
	targetUser : Object
    , user: Object 
    , created_at: Date
    , id : Number
    , text: String
});

exports.CommentSchema = mongoose.model('CommentSchema', CommentSchema);



