var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var GuimiSchema = new Schema({
	targetUid : Number
	,targetScreenName : String
    , screen_name: String 
    , uid: Number
    , comments: []
});

exports.GuimiSchema = mongoose.model('GuimiSchema', GuimiSchema);



