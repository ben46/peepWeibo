var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var GuimiSchema = new Schema({
	targetUser : Object
    , user: Object 
    , comments: []
    , count : Number
});

exports.GuimiSchema = mongoose.model('GuimiSchema', GuimiSchema);



