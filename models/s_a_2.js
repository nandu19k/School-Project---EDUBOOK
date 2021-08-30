var mongoose=require("mongoose");

var sa2Schema=new mongoose.Schema({
	telugu:Number,
	hindi:Number,
	english:Number,
	maths:Number,
	science:Number,
	social:Number,
	computer:Number
});

module.exports=mongoose.model("S_A_2",sa2Schema);