var mongoose=require("mongoose");

var noticeboardSchema=new mongoose.Schema({
	title:String,
	class:Number,
	from:String,
	created:{type:Date,default:Date.now},
	body:String
});

module.exports=mongoose.model("Notice",noticeboardSchema);
