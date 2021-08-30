const adminCollection = require('./db').db().collection("admin")
const bcrypt = require("bcryptjs")
let Admin = function(data) {
  this.data = data
  this.errors = []
}

Admin.prototype.cleanUp = function() {
  if (typeof(this.data.username) != "string") {this.data.username = ""}
  if (typeof(this.data.password) != "string") {this.data.password = ""}
 

  // get rid of any bogus properties
  this.data = {
    username: this.data.username.trim(),
    
    password: this.data.password

  }
}

Admin.prototype.login = function() {
  return new Promise((resolve, reject) => {
    this.cleanUp()
    adminCollection.findOne({username: this.data.username}).then((attemptedUser) => {
       if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password))  {
        resolve("Congrats!")
      } else {
        reject("Invalid username / password.")
      }
    }).catch(function() {
      reject("Please try again later.")
    })
  })
}

module.exports = Admin