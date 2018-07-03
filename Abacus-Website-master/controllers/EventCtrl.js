let sessionUtils = require('./../services/sessionUtils');
let Constants = require('./../constants');
let config = require('./../config');
let databaseUtils = require('./../services/databaseUtils');
let redisUtils = require('./../services/redisUtils');
let util = require('util');
let moment = require('moment');
const nodemailer = require('nodemailer');

module.exports = {

    Gallery: function*(next) {

        let clubid = this.request.query.clubid;
        let media_type = this.request.query.media_type;
        let eventid = this.request.query.eventid;
        let mediaList, eventList, clubList;
        let queryString, query;

        query = "select * from club";
        clubList = yield databaseUtils.executeQuery(query);

        if (!clubid && !media_type && !eventid) {
                query = "select file,media_type from event_media";
                mediaList = yield databaseUtils.executeQuery(query);
            }

        if (!clubid && media_type && !eventid) {
            queryString = "select file,media_type from event_media where media_type='%s'";
            query = util.format(queryString, media_type);
            mediaList = yield databaseUtils.executeQuery(query);
        }

        if(!media_type && clubid && !eventid) {
            queryString="select * from event where clubid=%s";
            query=util.format(queryString, clubid);
            eventList = yield databaseUtils.executeQuery(query);

            queryString="select file,media_type from event_media where eventid in(select eventid from event where clubid=%s)";
            query=util.format(queryString,clubid);
            mediaList = yield databaseUtils.executeQuery(query);

        }

        if(media_type && clubid && !eventid) {
            queryString="select eventid,event_name from event where clubid=%s";
            query=util.format(queryString,clubid);
            eventList = yield databaseUtils.executeQuery(query);

            queryString = "select file,media_type from event_media where media_type='%s' and eventid in(select eventid from event where clubid='%s')";
            query = util.format(queryString, media_type,clubid);
            mediaList = yield databaseUtils.executeQuery(query);

        }

        if(eventid) {

            if(clubid){
                queryString="select * from event where clubid=%s";
                query=util.format(queryString, clubid);
                eventList = yield databaseUtils.executeQuery(query);

                if(media_type) {
                    queryString="select file,media_type from event_media where eventid='%s' and media_type= '%s'";
                    query=util.format(queryString, eventid, media_type);
                    mediaList = yield databaseUtils.executeQuery(query);
                }
                else {
                    queryString="select file,media_type from event_media where eventid='%s'";
                    query=util.format(queryString, eventid);
                    mediaList = yield databaseUtils.executeQuery(query);
                }


            }
        }
        yield this.render('gallery', {
            mediaList : mediaList,
            eventList: eventList,
            clubList : clubList,
            clubid : clubid,
            media_type : media_type,
            eventid : eventid
        });
    },

    showEvents: function*(next) {

        let club_id = this.request.query.cid;
        let status = this.request.query.status;
        let query = "select * from club";
        let events_list;
        let club_list = yield databaseUtils.executeQuery(query);
        let isClubSelected=false;
        let isStatusSelected = false;

        if (club_id) {
            isClubSelected=true;
            if (status) {
                isStatusSelected=true;
                if (status === Constants.UPCOMING) {
                    queryString = "select * from event where current_timestamp<start_date_time and approved=1 and clubid='%s'";
                    query = util.format(queryString, club_id);
                }
                else if (status === Constants.PREVIOUS) {
                    queryString = "select * from event where current_timestamp>end_date_time and approved=1 and reviewed=1 and clubid='%s'";
                    query = util.format(queryString, club_id);
                }
                else if (status === Constants.ONGOING) {
                    queryString = "select * from event where current_timestamp < end_date_time and current_timestamp>start_date_time and approved=1 and reviewed=1 and clubid='%s'";
                    query = util.format(queryString, club_id);
                }
            }

            else {
                queryString = "select * from event where approved=1 and clubid='%s'";
                query = util.format(queryString, club_id);
            }

        }
        else {
            if (status) {
                isStatusSelected=true;
                if (status === Constants.UPCOMING) {
                    query = "select * from event where current_timestamp<start_date_time and approved=1";
                }
                else if (status === Constants.PREVIOUS) {
                    query = "select * from event where current_timestamp>end_date_time and approved=1 and reviewed=1";
                }
                else if (status === Constants.ONGOING) {
                    query = "select * from event where current_timestamp<end_date_time and current_timestamp>start_date_time and approved=1 and reviewed=1";
                }
            }
            else {
                query = "select * from event where approved=1";
            }
        }

        events_list = yield databaseUtils.executeQuery(query);

        yield this.render('events', {
            club_list: club_list,
            event_list: events_list,
            isClubSelected : isClubSelected,
            isStatusSelected : isStatusSelected,
            club_id : club_id,
            status : status
        });
    },

    showEventDetails: function*(next) {

        let currentUser = this.currentUser;
        if(currentUser){
            let message = this.request.query.message;

            let event_id = this.params.id;
            let queryString = "select * from event where eventid='%s'";
            let query = util.format(queryString, event_id);
            let event_details = yield databaseUtils.executeQuery(query);
            let coordinator={};
            let currentDate = moment();
            let startDate = moment(event_details[0].start_date_time);
            let endDate = moment(event_details[0].end_date_time);
            let event_status = (startDate > currentDate) ? "upcoming" : (endDate < currentDate ? 'previous' : 'ongoing');

            queryString = " select  event_name,venue ,description ,abacus_price,non_abacus_price,start_date_time ,end_date_time,total_seats,avilable_seats,event_photo from event where eventid='%s'";
            query = util.format(queryString, event_id);
            events_details = yield databaseUtils.executeQuery(query);

            queryString = "Select user.email , user.mobile_no ,user.name,user.year,user.photo,user.branch,user.course from (user inner join event_coordinator on user.id=event_coordinator.id) where event_coordinator.eventid='%s'";
            query = util.format(queryString, event_id);
            coordinator = yield databaseUtils.executeQuery(query);

            let email = this.currentUser.email;
            queryString = "Select name,email,id from user where email='%s'";
            query = util.format(queryString, email);
            let userDetails = yield databaseUtils.executeQuery(query);

            queryString = "Select clubname from club inner join event on club.clubid=event.clubid where eventid='%s'";
            query = util.format(queryString, event_details[0].eventid);
            let clubname_details = yield databaseUtils.executeQuery(query);

            queryString = "select description,reply from query where is_replied=1 and eventid='%s'";
            query = util.format(queryString,event_id);
            let faqQuestions = yield databaseUtils.executeQuery(query);

            yield this.render('event', {
        
                event_details: event_details,
                event_status: event_status,
                coordinator: coordinator,
                event_id : event_id,
                message : message,
                userDetails: userDetails,
                clubname_details : clubname_details,
                faqQuestions : faqQuestions
            })


        }
        else {
            this.redirect('/login?backRedirectUrl=/events');
        }
    },

    register: function*(next) {

        let message;
        let currentUser = this.currentUser;
        if(currentUser) {

            let email = this.currentUser.email;
            let eventid = this.params.eventid;
            let cancelRegistration = this.request.query.cancelRegistration;

            if (eventid) {
                let queryString = "select * from user where email='%s'";
                let query = util.format(queryString, email);
                let userDetails = yield databaseUtils.executeQuery(query);

                if(cancelRegistration === "yes"){

                    queryString = "delete from registration where id=%s and eventid = '%s'";
                    query = util.format(queryString,userDetails[0].id,eventid);
                    let result = yield databaseUtils.executeQuery(query);
                    if(result.affectedRows === 1){

                        queryString = "select avilable_seats from event where eventid='%s'";
                        query = util.format(queryString,eventid);
                        result = yield databaseUtils.executeQuery(query);


                        queryString = "update event set avilable_seats = %s where eventid = '%s'";
                        query = util.format(queryString,result[0].avilable_seats + 1 , eventid);
                        result = yield databaseUtils.executeQuery(query);

                        this.redirect('/event/' + eventid + '?message=Dear '+userDetails[0].name+', Your registration has successfully been canceled');
                    }
                    else {
                        this.redirect('/event/' + eventid + '?message=Dear '+userDetails[0].name+', Your have not registered in this event');
                    }
                    return;
                }

                queryString = "select eventid from registration where id=%s";
                query = util.format(queryString, userDetails[0].id);
                let registrationDetails = yield databaseUtils.executeQuery(query);
                let flag = 0;

                if (registrationDetails) {

                    for (let i in registrationDetails) {


                        if (eventid === registrationDetails[i].eventid) {
                            message = "You have already Registered";
                            flag = 1;
                            break;
                        }
                    }
                    if (flag === 0) {
                        message = "You have successfully Registered";
                    }
                }

                if (flag === 0) {

                    queryString = "select avilable_seats,event_name,start_date_time from event where eventid='%s'";
                    query = util.format(queryString, eventid);
                    let avilableSeats = yield databaseUtils.executeQuery(query);

                    if(avilableSeats[0].avilable_seats > 0){

                        queryString = "insert into registration(id,eventid) values(%s ,'%s')";
                        query = util.format(queryString, userDetails[0].id, eventid);
                        yield databaseUtils.executeQuery(query);

                        queryString = "update event set avilable_seats = %s where eventid='%s'";
                        query = util.format(queryString, avilableSeats[0].avilable_seats - 1, eventid);
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

                        let mailOptions = {

                            from: 'abacussocietygla@gmail.com', // sender address
                            to: email, // list of receivers
                            subject: 'Registration Successful', // Subject line
                            text: '', // plain text body
                            html: 'Dear '+userDetails[0].name+', You have successfully registered in <b>'+avilableSeats[0].event_name+'</b> which will start on <b>'+avilableSeats[0].start_date_time+'.</b>'
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('Message %s sent: %s', info.messageId, info.response);
                        });

                    }
                    else {message = "Sorry, Seats are full";}
                }
                this.redirect('/event/' + eventid + '?message=' + message);
            }
        }
        else {
            this.redirect("/login");
        }
    },

    eventFaq : function* (next) {

        let description = this.request.body.query;
        let id = this.request.body.id;
        let eventid = this.request.body.event_id;

        if(description){
            let queryString = "insert into query(description , id , eventid) values('%s', %s, '%s')";
            let query = util.format(queryString, description, id, eventid);
            yield databaseUtils.executeQuery(query);

            let message = "Your query has successfully been submitted ! We will respond you soon!";
            this.body = message;

        }
    }
};
