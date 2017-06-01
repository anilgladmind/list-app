var express 	= require('express'),
	app 		= express(),
	mongoose 	= require('mongoose'),
	bodyParser 	= require('body-parser'),
	config     	= require('./config/database'),
	port 		= 3000,
	path 		= require('path'),
	User 		= require('./Schema/user');

mongoose.Promise = global.Promise;
mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


app.use(bodyParser.urlencoded({extended: true}));     
app.use(bodyParser.json());                                             
app.use(express.static(__dirname + '/public/'));


app.get('/', (req, res) => {
	res.sendfile(__dirname + '/index.html');
})

// To get All users from Mongo
app.get('/api/users', (req, res) => {
  User.find({}, function(err,data){
	if(err) throw err;
	return res.json({message: "Successfully Get the Data", data:data});
  });
});


function successSave(response, err, userdetail){
	if(err){
		return response.json({success: false, msg: 'Username already exists.'});
	}else{
		User.find({}, function(error,data){
			if(error) throw error;
			response.json({message: "Added", data:data});
		})
	}
}

// To create new User 
app.post('/api/user',(req,res) => {
	var userdetail = new User(req.body);
    console.log(userdetail);	
    userdetail.save(successSave.bind(null,res));
});

// Update User
app.put('/api/user/:id', (req,res)=>{
	var id = req.params.id
		query = {_id:id},
		resObj = {};
	if(config.isEmpty(req.body)){
		res.json({message:"Bad Request",statusCode:404});
	}else{
		User.findOneAndUpdate(query, req.body, {upsert:true}, function(err,doc){
			if(err) throw err;
			resObj.message = "Successfully saved";
			User.find({},function(err,data){
				if(err) throw err;
				resObj.data = data;
				res.json(resObj);
			})
		})
	}
	
});

// Delete User
app.delete('/api/user/:id', (req,res)=>{
	var id = req.params.id,
		query = {_id:id},
		resObj = {};
	User.remove(query, function(err,doc){
		if(err){
			res.json({message:"User not deleted",user:doc,isDel:false});
		}else{
			res.json({message:"User deleted",user:doc,isDel:true});
		}
	})
})

// Server
app.listen(3000, function() {
  console.log('listening on 3000');
})