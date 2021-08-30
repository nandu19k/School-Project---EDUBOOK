var express   =require("express"),
    app       =express(),
    mongoose  =require("mongoose"),
	bodyparser=require("body-parser"),
methodOverride=require("method-override"),
    Student   =require("./models/student"),
    Teacher   =require("./models/teacher"),
    U_T_1     =require("./models/u_t_1"),
    U_T_2     =require("./models/u_t_2"),
    U_T_3     =require("./models/u_t_3"),
    U_T_4     =require("./models/u_t_4"),
    S_A_1     =require("./models/s_a_1"),
    S_A_2     =require("./models/s_a_2"),
    Notice    =require("./models/notice")

const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const User = require('./studentlogin')
const Teachers = require('./teacherlogin')
const Admin = require('./adminlogin')



 /*app.get("/check",function(req,res){
	Notice.find({}).sort({created:-1}).exec(function(err, result){
	if(err){console.log(err)}
	else
		{
			res.render("Teachers/visitnotice",{notice:result});
		}
});
});*/
//225 lo chnages levu?? eppudu kanipistunda changes

let sessionOptions = session({
  secret: "JavaScript is sooooooooo coool",
  store: new MongoStore({client: require('./db')}),
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 1000 * 60 * 60 * 24, httpOnly: true}
})

app.use(sessionOptions)

app.use(flash())




// app.use(express.urlencoded({extended: false}))
// app.use(express.json())

// mongoose.connect("mongodb://localhost:27017/project",{useNewUrlparser:true,useUnifiedTopology:true});
mongoose.connect("mongodb+srv://gogaga:gogaga@cluster0-mmav3.mongodb.net/gogaga?retryWrites=true&w=majority",{useNewUrlparser:true,useUnifiedTopology:true});
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + '/public'));

// Student.create({
// 	name:"Himanshu",
// 	class:1,
// });
// Teacher.create({
// 	name:"Lalitha Devi",
// 	subject:"social",
// })


app.get("/sample",function(req,res){
	res.render("sampledetails");
})
//login page of teacher
app.post("/teacherpage",function(req,res){
	res.render("teacherlogin");
})

//teacher login- teacher home page

app.post('/signup', function(req, res) {
  let teacher = new Teachers(req.body)
  teacher.register().then(() => {
    req.session.teacher = {username: teacher.data.username}
    req.session.save(function() {
      res.redirect('/teacherpage')
    })
  }).catch((regErrors) => {
    regErrors.forEach(function(error) {
		console.log(error)
      req.flash('regErrors', error)
    })
    req.session.save(function() {
      res.redirect('/teacherpage')
    })
  })
})

app.post('/loggin',function(req, res) {
  let teacher = new Teachers(req.body)
  teacher.login().then(function(result) {
    req.session.teacher = {favColor: "blue", username: teacher.data.username}
     req.session.save(function() {
      res.redirect('/teacherpage')
    })
  }).catch(function(e) {
    req.flash('errors', e)
    req.session.save(function() {
      res.redirect('/teacherpage')
    })
  })
})

app.post('/loggout',  function(req, res) {
  req.session.destroy(function() {
    res.redirect('/teacherpage')
  })
})
// Teacher home page route ..
app.get("/teacherpage",async function(req, res) {
  if (req.session.teacher) {
	  Teacher.findOne({contact_no:req.session.teacher.username},function(err,teacher){
		 
		  if(err)
			  {
				  
				  res.redirect("/teacherpage");
			  }
		  else if(teacher==null)
			  { 
				  res.render("studentnull"); 
				 
			  }
		  else
			  { Notice.find({}).sort({created:-1}).exec(function(err,notice){
				  if(err)
					  {
						  res.redirect("/teacherpage");
					  }
				  else
					  {
						  res.render('Teachers/teacherhome',{teacher:teacher,notice:notice});
					  }
			  })
				  
			  }
	  });	
    
  } else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});
//Teachers home page self details retrive route..
app.get("/selfdetails",function(req,res){
	if(req.session.teacher){
		Teacher.findOne({contact_no:req.session.teacher.username},function(err,teacher){
		 
		  if(err)
			  {
				  
				  res.redirect("/teacherpage");
			  }
			else
				{
					res.render("Teachers/selfdetails",{teacher:teacher});
				}
		});
		
	}
	else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});



//student registration form
app.get("/studentregister",function(req,res){
	res.render("studentsignup",{regErrors: req.flash('regErrors')});
})


//student login -student home page
app.post('/register', function(req, res) {
  let user = new User(req.body)
  user.register().then(() => {
    req.session.user = {username: user.data.username}
    req.session.save(function() {
      res.redirect('/')
    })
  }).catch((regErrors) => {
    regErrors.forEach(function(error) {
      req.flash('regErrors', error)
    })
    req.session.save(function() {
      res.redirect('/studentregister')
    })
  })
})

app.post('/login',function(req, res) {
  let user = new User(req.body)
  user.login().then(function(result) {
    req.session.user = {favColor: "blue", username: user.data.username}
     req.session.save(function() {
      res.redirect('/')
    })
  }).catch(function(e) {
    req.flash('errors', e)
    req.session.save(function() {
      res.redirect('/')
    })
  })
})

app.post('/logout',  function(req, res) {
  req.session.destroy(function() {
    res.redirect('/')
  })
})

app.get("/", function(req, res) {
  if (req.session.user) {
	  Student.findOne({contact_no:req.session.user.username},function(err,student){
		 
		  if(err)
			  {
				  
				  res.redirect("/");
			  }
		  else if(student==null)
			  { 
				  res.render("studentnull");
				 
			  } 
		  else
			  {
				  Notice.find({class:student.class}).sort({created:-1}).exec(function(err,notice){
					  if(err)
						  {
							  res.redirect("/");
						  }
					  else
						  { 
							  
							 res.render('studenthome',{student:student,notice:notice}); 
						  }
				  }) 
				 
			  }	  
			  
	  });	
    
  } else {
	  
    res.render('home' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
   
  }
});




//Admin login and admin home page
app.post('/adlogin',function(req, res) {
  let admin = new Admin(req.body)
  admin.login().then(function(result) {
    req.session.admin = {favColor: "blue", username: admin.data.username}
     req.session.save(function() { 
      res.redirect('/adminpage')
    })
  }).catch(function(error) {
	
    req.flash('errors', error)
	  
    req.session.save(function() {
      res.redirect('/adminpage')
    })
  })
})

app.post('/log-out',  function(req, res) {
  req.session.destroy(function() {
    res.redirect('/adminpage')
  })
})



app.get("/adminpage",async function(req, res) {
  if (req.session.admin) {
	 
  let posts =await  Notice.find({}).sort({created:-1})

	
    res.render('adminhome' , {notice:posts} )
  } else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});




//Login page of admin
app.post("/adminpage",function(req,res){
	res.render("adminlogin");
});




//ADMIN HOME NOTICE DISPLAY ROUTES
app.get("/adminhome",function(req,res){
	if(req.session.admin){
	res.redirect("/adminpage");
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
app.get("/adminnewNotice",function(req,res){
	if(req.session.admin){
	res.render("adminnotice/new");
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});


app.post("/adminnotice",function(req,res){
	var title=req.body.title;
	var clas=req.body.class;
	var from=req.body.from;
	var body =req.body.body;
	var newnotice={title:title,class:clas,from:from,body:body}
	
	Notice.create(newnotice,function(err,notice){
		if(err)
			{
				res.redirect("/adminnotice");
			}
		else
			{
				res.redirect("/adminpage");
			}
	})
	
});

// app.post("/adminnotice",function(req , res){
	
// 	let post = new Post(req.body )
	
// 	post.create().then(function(){
// 		res.send('Successfully saved your post')
// 	}).catch(function(errors){
// 		res.send(errors)
// 	})
// });
app.get("/adminnotice/:id",function(req,res){
	if(req.session.admin){
	Notice.findById(req.params.id,function(err,fnotice){
		if(err){res.redirect("/adminpage");}
		else{
			res.render("adminnotice/show",{notice:fnotice});
		}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
//routes to display class
// app.get("/selectclass",function(req,res){
// 	res.render("classes");
// });
//class wise students display routes
app.get("/class1",function(req,res){
	if(req.session.admin){
	Student.find({class:1},function(err,student){
		if(err)
			{
				res.redirect("/adminpage");
			}
		else
			{
				res.render("studentdisplay",{student:student})
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
app.get("/class2",function(req,res){
	if(req.session.admin){
	Student.find({class:2},function(err,student){
		if(err)
			{
				res.redirect("/adminpage");
			}
		else
			{
				res.render("studentdisplay",{student:student})
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
app.get("/class3",function(req,res){
	if(req.session.admin){
	Student.find({class:3},function(err,student){
		if(err)
			{
				res.redirect("/adminpage");
			}
		else
			{
				res.render("studentdisplay",{student:student})
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
app.get("/class4",function(req,res){
	if(req.session.admin){
	Student.find({class:4},function(err,student){
		if(err)
			{
				res.redirect("/adminpage");
			}
		else
			{
				res.render("studentdisplay",{student:student})
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
app.get("/class5",function(req,res){
	if(req.session.admin){
	Student.find({class:5},function(err,student){
		if(err)
			{
				res.redirect("/adminpage");
			}
		else
			{
				res.render("studentdisplay",{student:student})
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
app.get("/class6",function(req,res){
	if(req.session.admin){
	Student.find({class:6},function(err,student){
		if(err)
			{
				res.redirect("/adminpage");
			}
		else
			{
				res.render("studentdisplay",{student:student})
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
app.get("/class7",function(req,res){
	if(req.session.admin){
	Student.find({class:7},function(err,student){
		if(err)
			{
				res.redirect("/adminpage");
			}
		else
			{
				res.render("studentdisplay",{student:student})
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
app.get("/class8",function(req,res){
	if(req.session.admin){
	Student.find({class:8},function(err,student){
		if(err)
			{
				res.redirect("/adminpage");
			}
		else
			{
				res.render("studentdisplay",{student:student})
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
app.get("/class9",function(req,res){
	if(req.session.admin){
	Student.find({class:9},function(err,student){
		if(err)
			{
				res.redirect("/adminpage");
			}
		else
			{
				res.render("studentdisplay",{student:student})
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
app.get("/class10",function(req,res){
	if(req.session.admin){
	Student.find({class:10},function(err,student){
		if(err)
			{
				res.redirect("/adminpage");
			}
		else
			{
				res.render("studentdisplay",{student:student})
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
//Route for choosing the exam
// app.get("/testchoose/:id",function(req,res){
//      Student.findById(req.params.id,function(err,student){
// 		 if(err)
// 			 {
// 				 res.redirect("/adminpage");
// 			 }
// 		 else
// 			 {
// 				 res.render("marks/testchoose",{student:student});
// 			 }
// 	 })
// });

//ROUTES for viewing the results of the selected student
app.get("/ut1/:id",function(req,res){
	if(req.session.admin){
	Student.findById(req.params.id).populate("u_t_1").exec(function(err,student){
		if(err)
			{
				res.redirect("/adminpage");
			}
		else
			{
				res.render("marks/marksdisplay",{id:student});
			}
	})
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});

app.get("/ut2/:id",function(req,res){
	if(req.session.admin){
	Student.findById(req.params.id).populate("u_t_2").exec(function(err,student){
		if(err)
			{
				res.redirect("/adminpage");
			}
		else
			{   
			     res.render("marks/ut2display",{id:student});
				
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});

app.get("/ut3/:id",function(req,res){
	if(req.session.admin){
	Student.findById(req.params.id).populate("u_t_3").exec(function(err,student){
		if(err)
			{
				res.redirect("/adminpage");
			}
		else
			{
				res.render("marks/ut3display",{id:student});
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
app.get("/ut4/:id",function(req,res){
	if(req.session.admin){
	Student.findById(req.params.id).populate("u_t_4").exec(function(err,student){
		if(err)
			{
				res.redirect("/adminpage");
			}
		else
			{
				res.render("marks/ut4display",{id:student});
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
app.get("/sa1/:id",function(req,res){
	if(req.session.admin){
	Student.findById(req.params.id).populate("s_a_1").exec(function(err,student){
		if(err)
			{
				res.redirect("/adminpage");
			}
		else
			{
				res.render("marks/sa1display",{id:student});
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
app.get("/sa2/:id",function(req,res){
	if(req.session.admin){
	Student.findById(req.params.id).populate("s_a_2").exec(function(err,student){
		if(err)
			{
				res.redirect("/adminpage");
			}
		else
			{
				res.render("marks/sa2display",{id:student});
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
//CHOOSE THE TEST TO ENTER THE MARKS
app.get("/entermarks/:id",function(req,res){
	if(req.session.admin){
     Student.findById(req.params.id,function(err,student){
		 if(err)
			 {
				 res.redirect("/adminpage");
			 }
		 else
			 {
				 res.render("entermarks/marksnew",{id:student});
			 }
	 })
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
//routes for newly entering the marks
//submission form for Unittest 1 marks.
app.get("/:id/submission/ut1",function(req,res){
	if(req.session.admin){
	Student.findById(req.params.id,function(err,id){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("entermarks/ut1",{id:id});
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
//post route for the creation of marks for unittest 1
app.post("/:id/submitted/ut1",function(req,res){
	
	Student.findById(req.params.id).populate("u_t_1").exec(function(err,id){
		if(err)
			{
				console.log(err);
			}
		else
			{  U_T_1.create(req.body.u_t_1,function(err,ut){
					if(err)
						{
							console.log(err);
						}
					else
						{  
									id.u_t_1.push(ut);
							        id.save();
							        res.redirect("/class"+id.class);
						}
					
				})	  
						
		    }
		
	});
});

//submission form for Unittest 2 marks.
app.get("/:id/submission/ut2",function(req,res){
	if(req.session.admin){
	Student.findById(req.params.id,function(err,id){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("entermarks/ut2",{id:id});
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
//post route for the creation of marks for unittest 2
app.post("/:id/submitted/ut2",function(req,res){
	
	Student.findById(req.params.id).populate("u_t_2").exec(function(err,id){
		if(err)
			{
				console.log(err);
			}
		else
			{  U_T_2.create(req.body.u_t_1,function(err,ut){
					if(err)
						{
							console.log(err);
						}
					else
						{  
									id.u_t_2.push(ut);
							        id.save();
							        res.redirect("/class"+id.class);
						}
					
				})	  
						
		    }
		
	});
});
//submission form for Unittest 3 marks.
app.get("/:id/submission/ut3",function(req,res){
	if(req.session.admin){
	Student.findById(req.params.id,function(err,id){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("entermarks/ut3",{id:id});
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
//post route for the creation of marks for unittest 3
app.post("/:id/submitted/ut3",function(req,res){
	
	Student.findById(req.params.id).populate("u_t_3").exec(function(err,id){
		if(err)
			{
				console.log(err);
			}
		else
			{  U_T_3.create(req.body.u_t_1,function(err,ut){
					if(err)
						{
							console.log(err);
						}
					else
						{  
									id.u_t_3.push(ut);
							        id.save();
							        res.redirect("/class"+id.class);
						}
					
				})	  
						
		    }
		
	});
});
//submission form for Unittest 4 marks.
app.get("/:id/submission/ut4",function(req,res){
	if(req.session.admin){
	Student.findById(req.params.id,function(err,id){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("entermarks/ut4",{id:id});
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
//post route for the creation of marks for unittest 4
app.post("/:id/submitted/ut4",function(req,res){
	
	Student.findById(req.params.id).populate("u_t_4").exec(function(err,id){
		if(err)
			{
				console.log(err);
			}
		else
			{  U_T_4.create(req.body.u_t_1,function(err,ut){
					if(err)
						{
							console.log(err);
						}
					else
						{  
									id.u_t_4.push(ut);
							        id.save();
							        res.redirect("/class"+id.class);
						}
					
				})	  
						
		    }
		
	});
});
//submission form for S A 1 marks.
app.get("/:id/submission/sa1",function(req,res){
	if(req.session.admin){
	Student.findById(req.params.id,function(err,id){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("entermarks/sa1",{id:id});
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
//post route for the creation of marks for S A 1
app.post("/:id/submitted/sa1",function(req,res){
	
	Student.findById(req.params.id).populate("s_a_1").exec(function(err,id){
		if(err)
			{
				console.log(err);
			}
		else
			{  S_A_1.create(req.body.u_t_1,function(err,ut){
					if(err)
						{
							console.log(err);
						}
					else
						{  
									id.s_a_1.push(ut);
							        id.save();
							        res.redirect("/class"+id.class);
						}
					
				})	  
						
		    }
		
	});
});
//submission form for S A 2 marks.
app.get("/:id/submission/sa2",function(req,res){
	if(req.session.admin){
	Student.findById(req.params.id,function(err,id){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("entermarks/sa2",{id:id});
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
//post route for the creation of marks for S A 2
app.post("/:id/submitted/sa2",function(req,res){
	
	Student.findById(req.params.id).populate("s_a_1").exec(function(err,id){
		if(err)
			{
				console.log(err);
			}
		else
			{  S_A_2.create(req.body.u_t_1,function(err,ut){
					if(err)
						{
							console.log(err);
						}
					else
						{  
									id.s_a_2.push(ut);
							        id.save();
							        res.redirect("/class"+id.class);
						}
					
				})	  
						
		    }
		
	});
});
//routes for students details viewing
app.get("/viewdetails/:id",function(req,res){
	if(req.session.admin){
	Student.findById(req.params.id,function(err,student){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("detailsdisplay",{student:student});
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
//ROUTES FOR EDITING THE STDUENT DETAILS 
app.get("/viewdetails/:id/edit",function(req,res){
	if(req.session.admin){
	Student.findById(req.params.id,function(err,student){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("studentdetailsedit",{student:student});
			}
	})
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
//ROUTE FOR UPDATING THE EDITED DETAILS OF THE STDUENT
app.put("/viewdetails/:id",function(req,res){
	Student.findByIdAndUpdate(req.params.id,req.body.student,function(err,updated){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.redirect("/viewdetails/"+ req.params.id);
			}
	})
});

//Edit  And Update routes for the marks of the student test wise
//EDIT route for the unittest 1
app.get("/ut1/:id/:ut1_id/edit",function(req,res){
	if(req.session.admin){
	U_T_1.findById(req.params.ut1_id,function(err,foundtest){
		if(err)
			{
				console.log(err)//render back
			}
		else
			{
				res.render("marks/marksedit",{student_id:req.params.id, ut:foundtest});
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
//update route for ut1 marks
app.put("/editut1/:id/:ut1_id",function(req,res){
	U_T_1.findByIdAndUpdate(req.params.ut1_id,req.body.u_t_1,function(err,updatedmarks){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.redirect("/ut1/"+req.params.id);
			}
	})
});
//EDIT route for Unittest 2
app.get("/ut2/:id/:ut1_id/edit",function(req,res){
	if(req.session.admin){
	U_T_2.findById(req.params.ut1_id,function(err,foundtest){
		if(err)
			{
				console.log(err)//render back
			}
		else
			{
				res.render("marks/markseditut2",{student_id:req.params.id, ut:foundtest});
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
//update route for ut2
app.put("/editut2/:id/:ut1_id",function(req,res){
	U_T_2.findByIdAndUpdate(req.params.ut1_id,req.body.u_t_1,function(err,updatedmarks){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.redirect("/ut2/"+req.params.id);
			}
	})
});
//EDIT route for Unittest 3
app.get("/ut3/:id/:ut1_id/edit",function(req,res){
	if(req.session.admin){
	U_T_3.findById(req.params.ut1_id,function(err,foundtest){
		if(err)
			{
				console.log(err)//render back
			}
		else
			{
				res.render("marks/markseditut3",{student_id:req.params.id, ut:foundtest});
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
//update route for ut2
app.put("/editut3/:id/:ut1_id",function(req,res){
	U_T_3.findByIdAndUpdate(req.params.ut1_id,req.body.u_t_1,function(err,updatedmarks){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.redirect("/ut3/"+req.params.id);
			}
	})
});
//EDIT route for Unittest 4
app.get("/ut4/:id/:ut1_id/edit",function(req,res){
	if(req.session.admin){
	U_T_4.findById(req.params.ut1_id,function(err,foundtest){
		if(err)
			{
				console.log(err)//render back
			}
		else
			{
				res.render("marks/markseditut4",{student_id:req.params.id, ut:foundtest});
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
//update route for ut4
app.put("/editut4/:id/:ut1_id",function(req,res){
	U_T_4.findByIdAndUpdate(req.params.ut1_id,req.body.u_t_1,function(err,updatedmarks){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.redirect("/ut4/"+req.params.id);
			}
	})
});
//EDIT route for sa1
app.get("/sa1/:id/:ut1_id/edit",function(req,res){
	if(req.session.admin){
	S_A_1.findById(req.params.ut1_id,function(err,foundtest){
		if(err)
			{
				console.log(err)//render back
			}
		else
			{
				res.render("marks/markseditsa1",{student_id:req.params.id, ut:foundtest});
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
//update route for sa1
app.put("/editsa1/:id/:ut1_id",function(req,res){
	S_A_1.findByIdAndUpdate(req.params.ut1_id,req.body.u_t_1,function(err,updatedmarks){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.redirect("/sa1/"+req.params.id);
			}
	})
});
//EDIT route for Unittest 2
app.get("/sa2/:id/:ut1_id/edit",function(req,res){
	if(req.session.admin){
	S_A_2.findById(req.params.ut1_id,function(err,foundtest){
		if(err)
			{
				console.log(err)//render back
			}
		else
			{
				res.render("marks/markseditsa2",{student_id:req.params.id, ut:foundtest});
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
//update route for sa2
app.put("/editsa2/:id/:ut1_id",function(req,res){
	S_A_2.findByIdAndUpdate(req.params.ut1_id,req.body.u_t_1,function(err,updatedmarks){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.redirect("/sa2/"+req.params.id);
			}
	})
});

//ALL the teachers Display In ADMIN PAGE 
app.get("/teachersdisplay",function(req,res){
	if(req.session.admin){
	Teacher.find({},function(err,teacher){
		if(err){res.redirect("/adminhome");}
		else
			{
				res.render("Teachers/Teacherdetails",{teacher:teacher});
			}
	})
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
})
app.get("/teacher/:id",function(req,res){
	if(req.session.admin){
	Teacher.findById(req.params.id,function(err,teacher){
		if(err){res.redirect("/teachersdisplay");}
		else
			{
				res.render("Teachers/teacherdisplay",{teacher:teacher})
			}
	})
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
//TEACHERS DETAILS EDIT in ADMIN PAGE

app.get("/teacherdetails/:id/edit",function(req,res){
	if(req.session.admin){
	Teacher.findById(req.params.id,function(err,teacher){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("Teachers/teacherdetailsedit",{student:teacher});
			}
	});
	}
	else {
    res.render('adminlogin' , {	errors: req.flash('errors')})
  }
});
//ROUTE FOR UPDATING THE EDITED DETAILS OF THE TEACHER
app.put("/teacherdetails/:id",function(req,res){
	Teacher.findByIdAndUpdate(req.params.id,req.body.student,function(err,updated){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.redirect("/teacher/"+ req.params.id);
			}
	})
});



//teacher notice routes 
app.get("/teachernewNotice",function(req,res){
	if(req.session.teacher){
	res.render("teachernotice/new");
	}
	else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});

app.post("/teachernotice",function(req,res){
	if(req.session.teacher){
	var title=req.body.title;
	var clas=req.body.class;
	var from=req.body.from;
	var body =req.body.body;
	var newnotice={title:title,class:clas,from:from,body:body}
	
	Notice.create(newnotice,function(err,notice){
		if(err)
			{
				res.redirect("/teachernewNotice");
			}
		else
			{
				res.redirect("/teacherpage");
			}
	})
	}
	else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
	
});

app.get("/teachernotice/:id",function(req,res){
	if(req.session.teacher){
	Notice.findById(req.params.id,function(err,fnotice){
		if(err){res.redirect("/teacherpage");}
		else{
			res.render("teachernotice/show",{notice:fnotice});
		}
	})
	}
	else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});
//routes for choosing classes in teachers site
// app.get("/Tselectclass",function(req,res){
// 	res.render("Teachers/Tclasses");
// });
//class wise students display routes
app.get("/tclass1",function(req,res){
	if(req.session.teacher){
	Student.find({class:1},function(err,student){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("Teachers/Tstudentdisplay",{student:student})
			}
	});
	}
	else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});
app.get("/tclass2",function(req,res){
	if(req.session.teacher){
	Student.find({class:2},function(err,student){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("Teachers/Tstudentdisplay",{student:student})
			}
	});
	}
	else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});
app.get("/tclass3",function(req,res){
	if(req.session.teacher){
	Student.find({class:3},function(err,student){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("Teachers/Tstudentdisplay",{student:student})
			}
	});
	}
	else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});
app.get("/tclass4",function(req,res){
	if(req.session.teacher){
	Student.find({class:4},function(err,student){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("Teachers/Tstudentdisplay",{student:student})
			}
	});
	}
	else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});
app.get("/tclass5",function(req,res){
	if(req.session.teacher){
	Student.find({class:5},function(err,student){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("Teachers/Tstudentdisplay",{student:student})
			}
	});
	}
	else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});
app.get("/tclass6",function(req,res){
	if(req.session.teacher){
	Student.find({class:6},function(err,student){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("Teachers/Tstudentdisplay",{student:student})
			}
	});
	}
	else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});
app.get("/tclass7",function(req,res){
	if(req.session.teacher){
	Student.find({class:7},function(err,student){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("Teachers/Tstudentdisplay",{student:student})
			}
	});
	}
	else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});
app.get("/tclass8",function(req,res){
	if(req.session.teacher){
	Student.find({class:8},function(err,student){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("Teachers/Tstudentdisplay",{student:student})
			}
	});
	}
	else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});
app.get("/tclass9",function(req,res){
	if(req.session.teacher){
	Student.find({class:9},function(err,student){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("Teachers/Tstudentdisplay",{student:student})
			}
	});
	}
	else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});
app.get("/tclass10",function(req,res){
	if(req.session.teacher){
	Student.find({class:10},function(err,student){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("Teachers/Tstudentdisplay",{student:student})
			}
	});
	}
	else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});

//STUDENT PAGE ROUTES ..

// app.get("/",function(req,res){
// 	res.send(req.user.username);
// })

app.get("/dashboard",function(req,res){
	if(req.session.user)
		{Student.findOne({contact_no:req.session.user.username},function(err,student){
			if(err)
				{
					res.redirect("/");
				}
			else
				{
					res.render("student/dashboard",{student:student});
				}
		})
			
		}
	else {
    res.render('home' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});

// app.get("/Stestchoose/:id",function(req,res){
//      Student.findById(req.params.id,function(err,student){
// 		 if(err)
// 			 {
// 				 res.redirect("/");
// 			 }
// 		 else
// 			 {
// 				 res.render("student/testchoose",{student:student});
// 			 }
// 	 })
// });
//route for student notice read
app.get("/studentnotice/:id",function(req,res){
	if(req.session.user){
	Notice.findById(req.params.id,function(err,fnotice){
		if(err){res.redirect("/");}
		else{
			res.render("student/show",{notice:fnotice});
		}
	})
	}else {
    res.render('home' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
   
  }
});
//ROUTES for viewing the results of the selected student
app.get("/Sut1/:id",function(req,res){
	if(req.session.user){
	Student.findById(req.params.id).populate("u_t_1").exec(function(err,student){
		if(err)
			{
				res.redirect("/");
			}
		else
			{
				res.render("student/ut1display",{id:student});
			}
	})
	}else {
    res.render('home' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
   
  }
});

app.get("/Sut2/:id",function(req,res){
	if(req.session.user){
	Student.findById(req.params.id).populate("u_t_2").exec(function(err,student){
		if(err)
			{
				res.redirect("/");
			}
		else
			{   
			     res.render("student/ut2display",{id:student});
				
			}
	});
	}
	else {
    res.render('home' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
   
  }
});

app.get("/Sut3/:id",function(req,res){
	if(req.session.user){
	Student.findById(req.params.id).populate("u_t_3").exec(function(err,student){
		if(err)
			{
				res.redirect("/");
			}
		else
			{
				res.render("student/ut3display",{id:student});
			}
	});
	}
	else {
    res.render('home' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
   
  }
});
app.get("/Sut4/:id",function(req,res){
	if(req.session.user){
	Student.findById(req.params.id).populate("u_t_4").exec(function(err,student){
		if(err)
			{			
                res.redirect("/");
			}
		else
			{
				res.render("student/ut4display",{id:student});
			}
	});
	}
	else {
    res.render('home' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
   
  }
});
app.get("/Ssa1/:id",function(req,res){
	if(req.session.user){
	Student.findById(req.params.id).populate("s_a_1").exec(function(err,student){
		if(err)
			{
				res.redirect("/");
			}
		else
			{
				res.render("student/sa1display",{id:student});
			}
	});
	}
	else {
    res.render('home' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
   
  }
});
app.get("/Ssa2/:id",function(req,res){
	if(req.session.user){
	Student.findById(req.params.id).populate("s_a_2").exec(function(err,student){
		if(err)
			{
				res.redirect("/");
			}
		else
			{
				res.render("student/sa2display",{id:student});
			}
	});
	}
	else {
    res.render('home' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
   
  }
});
//Video routes...
app.get("/video1",function(req,res){
	if(req.session.user)
		{
			Student.findOne({contact_no:req.session.user.username},function(err,student){
				if(err)
					{
						res.redirect("/");
					}
				else
					{
						res.render("videos/class1",{student:student});
					}
			})
		}
	else {
    res.render('home' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});

app.get("/fees/:id",function(req,res){
	if(req.session.user){
	Student.findById(req.params.id,function(err,student){
		if(err)
			{
				res.redirect("/");
			}
		else
			{
				res.render("student/fee",{student:student});
			}
	})
	}
	else {
    res.render('home' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
   
  }
});
//DETAILS VIEW ROUTE of student in student page
app.get("/Sviewdetails/:id",function(req,res){
	if(req.session.user){
	Student.findById(req.params.id,function(err,student){
		if(err)
			{
				res.redirect("/teacherpage");
			}
		else
			{
				res.render("student/details",{student:student});
			}
	})
	}
	else {
    res.render('home' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
   
  }
});

// Teacher marks display routes.............
// app.get("/Ttestchoose/:id",function(req,res){
//      Student.findById(req.params.id,function(err,student){
// 		 if(err)
// 			 {
// 				 res.redirect("/teacherpage");
// 			 }
// 		 else
// 			 {
// 				 res.render("Teachers/testchoose",{student:student});
// 			 }
// 	 })
// });

//ROUTES for viewing the results of the selected student
app.get("/Tut1/:id",function(req,res){
	if(req.session.teacher){
	Student.findById(req.params.id).populate("u_t_1").exec(function(err,student){
		if(err)
			{
				res.redirect("/teacherpage");
			}
		else
			{
				res.render("Teachers/ut1display",{id:student});
			}
	})
	}
	else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});

app.get("/Tut2/:id",function(req,res){
	if(req.session.teacher){
	Student.findById(req.params.id).populate("u_t_2").exec(function(err,student){
		if(err)
			{
				res.redirect("/teacherpage");
			}
		else
			{   
			     res.render("Teachers/ut2display",{id:student});
				
			}
	});
	}
	else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});

app.get("/Tut3/:id",function(req,res){
	if(req.session.teacher){
	Student.findById(req.params.id).populate("u_t_3").exec(function(err,student){
		if(err)
			{
				res.redirect("/teacherpage");
			}
		else
			{
				res.render("Teachers/ut3display",{id:student});
			}
	});
	}
	else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});
app.get("/Tut4/:id",function(req,res){
	if(req.session.teacher){
	Student.findById(req.params.id).populate("u_t_4").exec(function(err,student){
		if(err)
			{
				res.redirect("/teacherpage");
			}
		else
			{
				res.render("Teachers/ut4display",{id:student});
			}
	});
	}
	else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});
app.get("/Tsa1/:id",function(req,res){
	if(req.session.teacher){
	Student.findById(req.params.id).populate("s_a_1").exec(function(err,student){
		if(err)
			{
				res.redirect("/teacherpage");
			}
		else
			{
				res.render("Teachers/sa1display",{id:student});
			}
	});
	}
	else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});
app.get("/Tsa2/:id",function(req,res){
	if(req.session.teacher){
	Student.findById(req.params.id).populate("s_a_2").exec(function(err,student){
		if(err)
			{
				res.redirect("/teacherpage");
			}
		else
			{
				res.render("Teachers/sa2display",{id:student});
			}
	});
	}
	else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});
// STUDENT details display for teacher
app.get("/Tviewdetails/:id",function(req,res){
	if(req.session.teacher){
	Student.findById(req.params.id,function(err,student){
		if(err)
			{
				res.redirect("/teacherpage");
			}
		else
			{
				res.render("Teachers/studentdetails",{student:student});
			}
	});
	}
	else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});

//EDIT ROUTES FOR TEACHER.
app.get("/Tut1/:id/:ut1_id/edit",function(req,res){
	if(req.session.teacher)
		{
						U_T_1.findById(req.params.ut1_id,function(err,foundtest){
		                if(err)
			            {
			 	           res.redirect("/teacherpage");
							
			            }
		                else
			            {
							Teacher.findOne({contact_no:req.session.teacher.username},function(err,teacher){
				                if(err){
					                res.redirect("/teacherpage");
				                }
								else
									{
										res.render("Teachers/ut1edit",{student_id:req.params.id, ut:foundtest,teacher:teacher});
									}
							});                
				           
			            }
	    
					
			});
		}
	 else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});
//update route for ut1 marks
app.put("/Teditut1/:id/:ut1_id",function(req,res){
	
	U_T_1.findByIdAndUpdate(req.params.ut1_id,req.body.u_t_1,function(err,updatedmarks){
		if(err)
			{
				res.redirect("/teacherpage");
			}
		else
			{
				res.redirect("/Tut1/"+req.params.id);
			}
	});
});
//EDIT route for Unittest 2
app.get("/Tut2/:id/:ut1_id/edit",function(req,res){
	if(req.session.teacher){
	U_T_2.findById(req.params.ut1_id,function(err,foundtest){
		if(err)
			{
				res.redirect("/teacherpage");
			}
		else
			{
				Teacher.findOne({contact_no:req.session.teacher.username},function(err,teacher){
				                if(err){
					                res.redirect("/teacherpage");
				                }
								else
									{
										res.render("Teachers/ut2edit",{student_id:req.params.id, ut:foundtest,teacher:teacher});
									}
							});        
			}
	});
	}
	 else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
	
});
//update route for ut2
app.put("/Teditut2/:id/:ut1_id",function(req,res){
	U_T_2.findByIdAndUpdate(req.params.ut1_id,req.body.u_t_1,function(err,updatedmarks){
		if(err)
			{
				res.redirect("/teacherpage");
			}
		else
			{
				res.redirect("/Tut2/"+req.params.id);
			}
	})
});
//EDIT route for Unittest 3
app.get("/Tut3/:id/:ut1_id/edit",function(req,res){
	if(req.session.teacher){
	U_T_3.findById(req.params.ut1_id,function(err,foundtest){
		if(err)
			{
				console.log(err)//render back
			}
		else
			{
				Teacher.findOne({contact_no:req.session.teacher.username},function(err,teacher){
				                if(err){
					                res.redirect("/teacherpage");
				                }
								else
									{
										res.render("Teachers/ut3edit",{student_id:req.params.id, ut:foundtest,teacher:teacher});
									}
							});        
			}
	});
	}
	 else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
	
});
//update route for ut2
app.put("/Teditut3/:id/:ut1_id",function(req,res){
	U_T_3.findByIdAndUpdate(req.params.ut1_id,req.body.u_t_1,function(err,updatedmarks){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.redirect("/Tut3/"+req.params.id);
			}
	})
});
//EDIT route for Unittest 4
app.get("/Tut4/:id/:ut1_id/edit",function(req,res){
	if(req.session.teacher){
	U_T_4.findById(req.params.ut1_id,function(err,foundtest){
		if(err)
			{
				console.log(err)//render back
			}
		else
			{
				Teacher.findOne({contact_no:req.session.teacher.username},function(err,teacher){
				                if(err){
					                res.redirect("/teacherpage");
				                }
								else
									{
										res.render("Teachers/ut4edit",{student_id:req.params.id, ut:foundtest,teacher:teacher});
									}
							});        
			}
	});
	}
	 else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});
//update route for ut4
app.put("/Teditut4/:id/:ut1_id",function(req,res){
	U_T_4.findByIdAndUpdate(req.params.ut1_id,req.body.u_t_1,function(err,updatedmarks){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.redirect("/Tut4/"+req.params.id);
			}
	})
});
//EDIT route for sa1
app.get("/Tsa1/:id/:ut1_id/edit",function(req,res){
	if(req.session.teacher){
	S_A_1.findById(req.params.ut1_id,function(err,foundtest){
		if(err)
			{
				console.log(err)//render back
			}
		else
			{
				Teacher.findOne({contact_no:req.session.teacher.username},function(err,teacher){
				                if(err){
					                res.redirect("/teacherpage");
				                }
								else
									{
										res.render("Teachers/sa1edit",{student_id:req.params.id, ut:foundtest,teacher:teacher});
									}
							});        
			}
	});
	}
	 else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});
//update route for sa1
app.put("/Teditsa1/:id/:ut1_id",function(req,res){
	S_A_1.findByIdAndUpdate(req.params.ut1_id,req.body.u_t_1,function(err,updatedmarks){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.redirect("/Tsa1/"+req.params.id);
			}
	})
});
//EDIT route for Unittest 2
app.get("/Tsa2/:id/:ut1_id/edit",function(req,res){
	if(req.session.teacher){
	S_A_2.findById(req.params.ut1_id,function(err,foundtest){
		if(err)
			{
				console.log(err)//render back
			}
		else
			{
				Teacher.findOne({contact_no:req.session.teacher.username},function(err,teacher){
				                if(err){
					                res.redirect("/teacherpage");
				                }
								else
									{ 
										res.render("Teachers/sa2edit",{student_id:req.params.id, ut:foundtest,teacher:teacher});
									}
							});        
			}
	});
	}
	 else {
    res.render('teacherlogin' , {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
});
//update route for sa2
app.put("/Teditsa2/:id/:ut1_id",function(req,res){
	S_A_2.findByIdAndUpdate(req.params.ut1_id,req.body.u_t_1,function(err,updatedmarks){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.redirect("/Tsa2/"+req.params.id);
			}
	})
});

module.exports = app
// app.listen(process.env.PORT,process.env.IP,function(){
// 	console.log("server started");
// });