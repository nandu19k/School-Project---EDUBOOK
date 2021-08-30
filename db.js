const mongodb = require('mongodb')

const connectionString = 'mongodb+srv://gogaga:gogaga@cluster0-mmav3.mongodb.net/gogaga?retryWrites=true&w=majority'

mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, function(err, client) {
    module.exports = client
  const app = require('./app')
 app.listen(process.env.PORT,process.env.IP,function(){
	console.log("server started");
});
})