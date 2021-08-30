var mongoose=require("mongoose");

var StudentSchema=new mongoose.Schema({
	name:String,
	class:Number,
	dob:String,
	f_name:String,
	m_name:String,
	contact_no:String,
	fees:Number,
	paidfees:Number,
	tobepaid:Number,
	u_t_1:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"U_T_1"
	}],
	u_t_2:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"U_T_2"
	}],
	u_t_3:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"U_T_3"
	}],
	u_t_4:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"U_T_4"
	}],
	s_a_1:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"S_A_1"
	}],
	s_a_2:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"S_A_2"
	}],
	
});
module.exports=mongoose.model("Student",StudentSchema);