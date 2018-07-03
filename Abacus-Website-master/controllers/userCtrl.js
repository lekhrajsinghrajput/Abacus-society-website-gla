let sessionUtils = require('./../services/sessionUtils');
let Constants = require('./../constants');
let config = require('./../config');
let databaseUtils = require('./../services/databaseUtils');
let redisUtils = require('./../services/redisUtils');
let util = require('util');
const nodemailer = require('nodemailer');

module.exports = {

    showLoginPage: function*(next) {
        let errorMessage = "";

        let backRedirectUrl = this.request.header.referer;
        yield this.render('login', {
            errorMessage: errorMessage,
            backRedirectUrl: backRedirectUrl
        });
    },

    login: function*(next) {
        
        let email = this.request.body.email;
        let password = this.request.body.password;
        let backRedirectUrl = this.request.body.backRedirectUrl;
    
        let queryString = "select id,email,gender,photo from user where email = '%s' and password = '%s' and isVerified=1";
        let query = util.format(queryString, email, password);
        let results = yield databaseUtils.executeQuery(query);

        if (results.length === 0) {
            let errorMessage = Constants.LOGIN_EMAIL_ERROR;
            yield this.render('login', {
                errorMessage: errorMessage,
                backRedirectUrl: backRedirectUrl

            });
        }
        else {

            sessionUtils.saveUserInSession(results[0], this.cookies);
            this.redirect(backRedirectUrl);
        }
    },

    logout: function*(next) {

        let sessionId = this.cookies.get("SESSION_ID");
        sessionUtils.deleteSession(sessionId);

        this.redirect(this.request.header.referer);
    },

    showSignupPage: function*(next) {
	let errorMessage= '';

        yield this.render('signup', {
            errorMessage: errorMessage,
		
        });
    },

    signup: function*(next) {
        let email = this.request.body.fields.email;
        let password = this.request.body.fields.password;
        let mobile_no = this.request.body.fields.mobile_no;
        let name = this.request.body.fields.name;
        let course = this.request.body.fields.course;
        let branch = this.request.body.fields.branch;
        let year = this.request.body.fields.year;
        let gender = this.request.body.fields.gender;
        let dob = this.request.body.fields.dob;

	if(this.request.body.fields['g-recaptcha-response'] === undefined || this.request.body.fields['g-recaptcha-response'] === '' || this.request.body.fields['g-recaptcha-response'] === null) {

let errorMessage = 'Invalid Recaptcha';
            yield this.render('signup', {
                errorMessage: errorMessage
            });

	}
	else{

        if(course === undefined || year === undefined || branch === undefined){
            course = "null"; 
            branch = "null";
        }

        let imageFiles = this.request.body.files.images;

        var fs = require('fs');
        let queryString = "select * from user where email = '%s' and isVerified = 1";
        let query = util.format(queryString, email);
        let results = yield databaseUtils.executeQuery(query);

        let mediaSize = imageFiles.size;
        let pathFile = "null";

        if (results.length === 0) {

            if (mediaSize !== 0) {

                pathFile = 'static/user-photos/' + email;

                let gm = require('gm').subClass({imageMagick: true});

                gm(imageFiles.path)
                    .resize(240,240)
                    .write(pathFile, function (err) {
                        if (err) console.log(err);
                    });
                pathFile = '/' + pathFile;
            }
            else {
                if(gender == 'male'){
                    pathFile = '/static/images/userPhotoMale.jpg';
                }
                else {
                    pathFile = '/static/images/userPhotoFemale.jpg';
                }
            }

            queryString = "select * from user where email = '%s'";
            query = util.format(queryString, email);
            let results = yield databaseUtils.executeQuery(query);

            if(course === "null"){year = 0}

            if (results.length === 0) {

                queryString = "insert into user(name , password , email , mobile_no , photo , course , branch , year , gender,dob) values('%s','%s','%s',%s,'%s','%s','%s',%s,'%s','%s')";
                query = util.format(queryString, name, password, email, mobile_no, pathFile, course, branch,year, gender, dob);

                let a = yield databaseUtils.executeQuery(query);

                queryString = "select id from user where email = '%s'";
                query = util.format(queryString, email);
                results = yield databaseUtils.executeQuery(query);


                queryString = "insert into user_role values(%s, 'r3')";
                query = util.format(queryString, results[0].id);
                result = yield databaseUtils.executeQuery(query);

            }
            else {

                queryString = "update user set name = '%s', password ='%s', mobile_no =%s, photo ='%s', course ='%s', branch ='%s', year=%s , gender ='%s' ,dob ='%s' where email='%s' ";
                query = util.format(queryString, name, password, mobile_no, pathFile, course, branch, year, gender, dob,email);
                yield databaseUtils.executeQuery(query);

            }

                fs.unlink(imageFiles.path, function (err) {
                    if (err) throw err;
                    console.log('File deleted!');
                });

            this.redirect('/signupVerification?email=' + email);
        }

        else {
            let errorMessage = Constants.SIGNUP_EMAIL_ERROR;
            yield this.render('signup', {
                errorMessage: errorMessage
            });
        }

	}
    },

    signupVerification: function*(next) {

        let code = this.request.query.code;
        let email = this.request.query.email;
        if (code) {

            let queryString = "select isVerified from user where email = '%s'";
            let query = util.format(queryString, email);
            let codeResult = yield databaseUtils.executeQuery(query);

            if (codeResult[0].isVerified === code) {

                queryString = "update user set isVerified = 1 where email = '%s'";
                query = util.format(queryString, email);
                yield databaseUtils.executeQuery(query);

                queryString = "select * from user where email = '%s' and isVerified=1";
                query = util.format(queryString, email);
                let results = yield databaseUtils.executeQuery(query);

                if (results[0].length === 0) {

                    this.redirect('/home?errorContactToAdmin=Something Went Wrong? Please Contact to Admin!');
                    return 0;
                }
                else {

                    sessionUtils.saveUserInSession(results[0], this.cookies);
                    this.redirect('/home');
                    return 0;
                }
            }
		else{
			let errorMessage = 'Invalid verification code';
			let renderByForgetPasswordPage;
			yield this.render('signupVerification',{
				renderByForgetPasswordPage : renderByForgetPasswordPage,
				email : email,
				errorMessage : errorMessage		
			});
			return;
			
		}
		
        }

        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        let queryString = "update user set isVerified='%s' where email = '%s'";
        let query = util.format(queryString, text, email);
        yield databaseUtils.executeQuery(query);

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // secure:true for port 465, secure:false for port 587
            auth: {
                user: 'abacussocietygla@gmail.com',
                pass: 'sciencesciences8307'
            }
        });
// setup email data with unicode symbols
        let mailOptions = {
            from: 'abacussocietygla@gmail.com', // sender address
            to: email, // list of receivers
            subject: 'Verify Your account', // Subject line
            text: '', // plain text body
            html: 'Your Verification code is ' + text // html body
        };

// send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
	console.log(1);

              
     
			
            }
		else{
            console.log('Message %s sent: %s', info.messageId, info.response);
}
        });
        let renderByForgetPasswordPage;
	let errorMessage = '';
console.log(email);
        yield this.render('signupVerification', {

            email: email,
		errorMessage:errorMessage,
            renderByForgetPasswordPage : renderByForgetPasswordPage
        })
    },

    updateuserDetails: function *(next) {

        let currentUser = this.currentUser;
        if (currentUser) {
            let email = this.currentUser.email;
            let errorMessage = this.request.query.errorMessage;

            let queryString = "select *from user where email='%s'";
            let query = util.format(queryString, email);
            let prev = yield databaseUtils.executeQuery(query);
            yield this.render('updateUser', {
                prev: prev,
                errorMessage: errorMessage
            });
        }
        else {
            this.redirect('/login');
        }

    },

    updateuser: function *(next) {

        let currentUser = this.currentUser;

        if (currentUser) {

            let email = this.currentUser.email;
            let password = this.request.body.fields.newpassword;
            let oldpassword = this.request.body.fields.oldpassword;
            let mobile_no = this.request.body.fields.mobile_no;
            let course = this.request.body.fields.course;
            let branch = this.request.body.fields.branch;
            let year = this.request.body.fields.year;
            let gender = this.request.body.fields.gender;
            let errorMessage = '';

            let imageFiles = this.request.body.files.images;
            let mediaSize, pathFile = "null";
            mediaSize = imageFiles.size;
            let fs = require('fs');
            if (mediaSize !== 0) {

                pathFile = 'static/user-photos/' + email;

                let gm = require('gm').subClass({imageMagick: true});

                gm(imageFiles.path)
                    .resize(240,240)
                    .write('static/user-photos/' + email, function (err) {
                        if (err) {

				fs.rename(imageFiles.path, 'static/user-photos/' + email, function (err) {
                    			if (err) throw err;
                		});
			}
			else{
					 fs.unlink(imageFiles.path, function (err) {
        			            if (err) throw err;
        			         });
			
			}
                    });
                pathFile = '/' + pathFile;

            }
            else {
                if(gender == 'male'){
                    pathFile = '/static/images/userPhotoMale.jpg';
                }
                else {
                    pathFile = '/static/images/userPhotoFemale.jpg';
                }
            }

            queryString = " select password,name from user where email='%s'";
            query = util.format(queryString, email);
            let oldpass = yield databaseUtils.executeQuery(query);

            if(course==undefined || branch ==undefined || course=="null" || branch =="null" || year ==undefined ){
                course = "null";
                branch = "null";
                year = 0;
            }


            if (oldpass[0].password === oldpassword) {


                queryString = "update user set name='%s',password='%s',mobile_no=%s,course='%s',branch='%s',year=%s,gender='%s', photo='%s' where email='%s'";
                query = util.format(queryString, oldpass[0].name, password, mobile_no, course, branch, year, gender, pathFile, email);
                yield databaseUtils.executeQuery(query);

                queryString = "select * from user where email = '%s' and isVerified=1";
                query = util.format(queryString, email);
                let results = yield databaseUtils.executeQuery(query);
                sessionUtils.saveUserInSession(results[0], this.cookies);
                this.redirect('/home');
            }
            else {

                this.redirect('/updateuser?errorMessage=Old password is not correct');
            }


        }
    },

    forgetPasswordPage: function*(next) {
        let errorMessage;
        yield this.render('forgetPassword', {
            errorMessage: errorMessage
        });
    },


    forgetPassword: function*(next) {

        let email = this.request.body.email;
        let password = this.request.body.password;

        if (email && password) {

            let text = "";
            let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (let i = 0; i < 5; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));


            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // secure:true for port 465, secure:false for port 587
                auth: {
                    user: 'abacussocietygla@gmail.com',
                    pass: 'sciencesciences8307'
                }
            });

            let mailOptions = {
                from: 'abacussocietygla@gmail.com', // sender address
                to: email, // list of receivers
                subject: 'Recover Password', // Subject line
                text: '', // plain text body
                html: '<link href="https://fonts.googleapis.com/event?family=Montserrat" rel="stylesheet"><style>body{font-family: "Montserrat", serif;}</style><h3>Dear Abacus User,</h3><p>Someone has requested to recover the password for your account on abacus website.</p><p><b>If it was you,</b> then enter <b>'+text+'</b>.</p> <p>The New password that you entered in the form will be activated.</p><b>This code is valid for fifteen minutes only.</b><h4 style="color: red">If it was not you then please ignore this message.</h4><b>Thank you</b>' // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
            });

            let queryString = "select email from forget_password where email = '%s'";
            let query = util.format(queryString,email);
            let result = yield databaseUtils.executeQuery(query);


            if(result[0]){
                queryString = "update forget_password set verification_code ='%s', password = '%s' where email = '%s'";
                query = util.format(queryString,text,password,email);

                yield databaseUtils.executeQuery(query);
            }
            else {

                queryString = "insert into forget_password(email,verification_code,password) values('%s','%s','%s')";
                query = util.format(queryString,email,text,password);

                yield databaseUtils.executeQuery(query);
            }

            let renderByForgetPasswordPage=1;
		let errorMessage = '';
            yield this.render('signupVerification', {
		errorMessage : errorMessage,
                email:email,
                renderByForgetPasswordPage : renderByForgetPasswordPage

            });
        }
        else {

            let errorMessage = "Please fill out all the fields";
            yield this.render('forgetPassword', {
                errorMessage: errorMessage
            });
        }
    },
    recoverPassword : function* (next) {

        let email = this.request.body.email;
        let code  = this.request.body.code;

        let queryString, query;

        queryString = "select * from forget_password where email = '%s'";
        query = util.format(queryString, email);
        let result = yield databaseUtils.executeQuery(query);

        if(result[0].verification_code === code){

            queryString = "update user set password = '%s' where email = '%s'";
            query = util.format(queryString,result[0].password, email);
            yield databaseUtils.executeQuery(query);

            this.redirect('/home');
        }
	else{
		let errorMessage = 'invalid verification code';
		let renderByForgetPasswordPage = 1;
		yield this.render('signupVerification',{
			renderByForgetPasswordPage : renderByForgetPasswordPage,
			email : email,
			errorMessage : errorMessage		
		});
	}
    },
    userprofile : function* (next) {

        let id = this.currentUser.id;


        if(id){

            let = queryString = "select * from user where id = %s";
            let = query = util.format(queryString,id);
            let userDetails = yield databaseUtils.executeQuery(query);
            yield this.render('userprofile', {
                userDetails : userDetails
            });
        }
        else{
            this.redirect('/login');
        }
    }

};
