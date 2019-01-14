const Promise = require('promise');
const express = require('express');
const app = express();
const server = app.listen(5000);
const io = require('socket.io')(server);
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

app.use(express.static(path.resolve('dist')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser('asfgdkaljieaienvonwcnpwefef'));
app.set('trust proxy', 1);
app.use(
	session({
		secret: 'victoriassecrect', 
		resave: false, 
		saveUninitialized: true, 
		rolling: true,
		name: 'session',
		cookie: {
			secure: false,
			httpOnly: false,
			maxAge: 6000000000 } 
		})
	);

const UserSchema = new mongoose.Schema({
    first_name: {type: String, required: [true, 'Missing first name.'], minlength: [2, `First Name is too short. (2-25 characters)`], maxlength : [25, 'First Name is too long. (2-25 characters)']},
    last_name : {type: String, required: [true, 'Missing last name.'], minlength : [2, `Last Name is too short. (2-25 characters)`], maxlength : [25, 'Last Name is too long. (2-25 characters)']},
    email: {
        type: String,
        validate: {
          isAsync: true,
          validator: (e, validate) => {
              User.find({email:e},(err,email) => {
                  validate(email.length === 0 && /^\w+@\w+[.]{1}[\w.]+$/.test(e), email.length !== 0 ? "Email already exists." : `${e} is not a valid email!`);
              });
          },
          // Default error message, overridden by 2nd argument to `cb()` above
          message: 'Default error message'
        },
        required: [true, 'Email field is blank.'], maxlength : [25, 'Email must be 25 characters or less in length.']
      },
    birthday : {
        type: Date,
        validate: { validator: d => {
            let current = new Date();
            return d < new Date(current.getFullYear()-18, current.getMonth(), current.getDate());
        }, message: `You must be 18 years or older to register.` },
        required: [true, 'Birthdate is missing.']
      },
    password : {
        type: String,
        validate: { validator: p => { return /^(?=.*[0-9])(?=.*[A-Z])([a-zA-Z0-9!@#$%^&*()]{8,16})$/.test(p); }, message: `Password must be 8-16 characters and contain atleast one number and uppercase letter.` },
        required: [true, 'Password field is blank.']
      },
    cpassword : {
        type: String,
        validate: { validator: function() { return this.password === this.cpassword }, message: `Passwords do not match.` },
        required: [true, 'Second password field is blank.']
      },
	address1: {type: String, required: [true, 'Missing address1.'], minlength: [2, `Address1 is too short. (2-25 characters)`], maxlength : [25, 'Address1 is too long. (2-25 characters)']},
    address2 : {type: String, required: false, maxlength : [25, 'Address2 is too long. (25 characters or less)']},
	city: {type: String, required: [true, 'Missing city.'], minlength: [2, `City name is too short. (2-25 characters)`], maxlength : [25, 'City ame is too long. (2-25 characters)']},
    state: {type: String, required: [true, 'Missing state.'], minlength : [2, `State name is too short. (2-25 characters)`], maxlength : [25, 'State name is too long. (2-25 characters)']}
}, {timestamps: true })

mongoose.connect('mongodb://localhost:27017/login_registration');
mongoose.model('User', UserSchema);
const User = mongoose.model('User');

app.post('/register', (request, response) => {

    let user = new User();
	
    for(let field in request.body) user[field] = request.body[field];

    user.save( err => {
        if(err) {
			let errors = {};
            for(let error in err.errors) errors[error] = (err.errors[error].message);
			//const errors = Object.key(err.errors).map( key => err.errors[key].message );
            return response.json({message: 'Error', errors: errors});
        }
        else {

            bcrypt.hash(request.body.password, 10).
                then( hpassword => {
                        User.update({_id:user._id},{$set:{password:hpassword, cpassword:hpassword}}, result => {
                            //user.password = user.cpassword = null;
							completeLogin(request, response, user);
                            return response.json({message: 'Success', user: user});
                        });
                }).catch( error => console.log(error) );
        }
    })
})

app.post('/user', (request, response)=> {
	//console.log("server");
	User.findOne({_id: mongoose.Types.ObjectId(request.body.id) }, (err, user)=> {
			return response.json({user:user});
		}
	)
	//return response.json({user:null});
})

		
app.post('/login', (request, response) => {

    User.findOne({email:request.body.email},(err, user) => {

        //if(err) for(let error in err.errors) request.flash('errors', err.errors[error].message);

        if(user)
            bcrypt.compare(request.body.password, user.password).then( result => {
                if(result){
                    //user.password = user.cpassword = null;
                    completeLogin(request, response, user);
                    return response.json({message: 'Success', user: user});
                }
                else {
                    //request.flash('errors', 'Invalid password entered.'); // Not sure what condition will trigger this error
                    return response.json({message: 'Error', error : "Invalid Password Entered."});
                }
            }).catch( error => { response.json({message: 'Error', error : "Invalid Password Entered."}); });
		else {
			//request.flash('errors', `User not found for email: '${request.body.email}'`);
			return response.json({message: 'Error', error : "User not found."});
		}
    })
})

function completeLogin(request, response, user){
	user.password = null;
	user.cpassword = null;
	user.__v = null;
    request.session.user = user;
	response.cookie('userID', user._id.toString());
	response.cookie('expiration', Date.now() + 86400 * 1000);
}

app.delete('/logout', (request, response) => {
    request.session.destroy;
	response.clearCookie('userID');
	response.clearCookie('expiration');
	return response.json(true);
    //return response.redirect('/');
})

app.all("*", (req,res,next) => {
  res.sendFile(path.resolve("./dist/index.html"))
});