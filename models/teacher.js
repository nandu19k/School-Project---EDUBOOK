var mongoose=require("mongoose");

var TeacherSchema=new mongoose.Schema({
	name:String,
	subject:String,
	dob:String,
	f_name:String,
	m_name:String,
	contact_no:String,
	salary:Number,
	education:String,
	address:String
	
});
module.exports=mongoose.model("Teacher",TeacherSchema);