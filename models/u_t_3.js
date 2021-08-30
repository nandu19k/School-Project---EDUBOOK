var mongoose=require("mongoose");

var Ut3Schema=new mongoose.Schema({
	telugu:Number,
	hindi:Number,
	english:Number,
	maths:Number,
	science:Number,
	social:Number,
	computer:Number
});

module.exports=mongoose.model("U_T_3",Ut3Schema);