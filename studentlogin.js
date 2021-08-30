const usersCollection = require('./db').db().collection("users")
const validator = require("validator")
const bcrypt = require("bcryptjs")

let User = function(data) {
  this.data = data
  this.errors = []
}

User.prototype.cleanUp = function() {
  if (typeof(this.data.username) != "string") {this.data.username = ""}
  if (typeof(this.data.password) != "string") {this.data.password = ""}
  if (typeof(this.data.psw) != "string") {this.data.psw = ""}

  // get rid of any bogus properties
  this.data = {
    username: this.data.username.trim(),
    
    password: this.data.password,
	 psw:this.data.psw
  }
}
User.prototype.validate = function() {
  return new Promise(async (resolve, reject) => {
     if (this.data.username == "") {this.errors.push("You must provide your Phone number.")}
  if (this.data.username != "" && !validator.isNumeric(this.data.username)) {this.errors.push("Username can only contain  numbers.")}
  if (this.data.password == "") {this.errors.push("You must provide a password.")}
  if (this.data.password.length > 0 && this.data.password.length < 6) {this.errors.push("Password must be at least 6 characters.")}
  if (this.data.password.length > 100) {this.errors.push("Password cannot exceed 100 characters.")}
  if (this.data.username.length > 0 && this.data.username.length < 3) {this.errors.push("Username must be at least 3 characters.")}
  if (this.data.username.length != 10) {this.errors.push("Phone number provided is invalid .")}
  if(this.data.password != this.data.psw){this.errors.push("Your password is not matching")}
  
    // Only if username is valid then check to see if it's already taken
    if ( this.data.username.length ==10 && validator.isNumeric(this.data.username)) {
      let usernameExists = await usersCollection.findOne({username: this.data.username})
      if (usernameExists) {this.errors.push("That username is already taken.")}
    }
  
    
    resolve()
  })
}



User.prototype.register = function() {
  return new Promise(async (resolve, reject) => {
    // Step #1: Validate user data
    this.cleanUp()
    await this.validate()
  
    // Step #2: Only if there are no validation errors 
    // then save the user data into a database
    if (!this.errors.length) {
      // hash user password
      let salt = bcrypt.genSaltSync(10)
      this.data.password = bcrypt.hashSync(this.data.password, salt)
		this.data.psw = bcrypt.hashSync(this.data.psw, salt)
      await usersCollection.insertOne(this.data)
      resolve()
    } else {
      reject(this.errors)
    }
  })
}

User.prototype.login = function() {
  return new Promise((resolve, reject) => {
    this.cleanUp()
    usersCollection.findOne({username: this.data.username}).then((attemptedUser) => {
      if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
        resolve("Congrats!")
      } else {
        reject("Invalid username / password.")
      }
    }).catch(function() {
      reject("Please try again later.")
    })
  })
}

module.exports = User