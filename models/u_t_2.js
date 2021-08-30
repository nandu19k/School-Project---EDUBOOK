var mongoose=require("mongoose");

var Ut2Schema=new mongoose.Schema({
	telugu:Number,
	hindi:Number,
	english:Number,
	maths:Number,
	science:Number,
	social:String,
	computer:Number,

});

module.exports=mongoose.model("U_T_2",Ut2Schema);