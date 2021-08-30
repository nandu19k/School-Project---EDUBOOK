var mongoose=require("mongoose");

var Ut1Schema=new mongoose.Schema({
	telugu:Number,
	hindi:Number,
	english:Number,
	maths:Number,
	science:Number,
	social:Number,
	computer:Number,
	
});

module.exports=mongoose.model("U_T_1",Ut1Schema);