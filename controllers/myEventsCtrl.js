let sessionUtils = require('./../services/sessionUtils');
let Constants = require('./../constants');
let config = require('./../config');
let databaseUtils = require('./../services/databaseUtils');
let redisUtils = require('./../services/redisUtils');
let util = require('util');

module.exports = {

    myEvents: function*(next) {
        let addMessage=this.request.query.addMessage;

        let currentUser = this.currentUser;     //check user in session

        if (currentUser) {

            let id = this.currentUser.id;  //get user id
            let queryString,query;

            /*------Get user Role--------*/

            queryString = "select role_id from user_role where id=%s";
            query = util.format(queryString,id);
            let roles = yield databaseUtils.executeQuery(query);

            let roleVar = "r3";
            for(let i in roles){

                if(roles[i].role_id < roleVar)
                    roleVar = roles[i].role_id;
            }

            /*----------------------------*/

            queryString = "Select * from event inner join registration on event.eventid=registration.eventid where registration.id='%s'";
            query = util.format(queryString, id);
            let registered_events_list = yield databaseUtils.executeQuery(query);

            /*--------only for standard user--------*/

            if(roleVar === "r3"){

                yield this.render('myevents',{

                    registered_events_list : registered_events_list,
                    roleVar : roleVar,
                    addMessage : addMessage
                });
return;
            }

            /*----------------------------------------*/

            let reply=this.request.query.reply;
            let uploadMediaMessage=this.request.query.uploadMediaMessage;
            let qid=this.request.query.qid;

            queryString = "Select * from (event inner join event_coordinator on event.eventid=event_coordinator.eventid) where event_coordinator.id=%s";
            query = util.format(queryString, id);
            let hosted_events_list = yield databaseUtils.executeQuery(query);

            query = "select clubname from club";
            let clubnames = yield databaseUtils.executeQuery(query);
let update_events_list;
if(roleVar === "r2"){
            queryString = "select * from event where start_date_time>current_timestamp and id=%s";
            query = util.format(queryString, id);
            update_events_list = yield databaseUtils.executeQuery(query);
}

if(roleVar === "r1"){
            queryString = "select * from event where start_date_time>current_timestamp";
            query = util.format(queryString);
            update_events_list = yield databaseUtils.executeQuery(query);
}


            queryString = "select description,eventid,qid,reply from query where eventid in (select eventid from event where id =%s) order by eventid asc";
            query = util.format(queryString, id);
            let replyResult = yield databaseUtils.executeQuery(query);

            let eventForReply=[], temp;

            for(let i in replyResult){

                queryString = "select event_name from event where eventid = '%s'";
                query = util.format(queryString,replyResult[i].eventid);
                temp = yield databaseUtils.executeQuery(query);
                eventForReply=eventForReply.concat(temp[0].event_name);
            }

            if(reply){

                queryString = "update query set reply = '%s',is_replied=1 where qid=%s";
                query = util.format(queryString,reply,qid);
                yield databaseUtils.executeQuery(query);
            }

            /*--------only for coordinator--------*/

            if(roleVar === "r2"){

                yield this.render('myevents',{

                    registered_events_list : registered_events_list,
                    roleVar : roleVar,
                    hosted_events_list: hosted_events_list,
                    clubnames : clubnames,
                    update_events_list: update_events_list,
                    replyResult : replyResult,
                    eventForReply : eventForReply,
                    uploadMediaMessage : uploadMediaMessage,
                    addMessage : addMessage
                });
            }

            /*----------------------------------------*/



            query = "select * from event where current_timestamp>end_date_time and approved=1";
            let previous_events_list = yield databaseUtils.executeQuery(query);

            query = "select * from event where current_timestamp<start_date_time and approved=1";
            let upcoming_events_list = yield databaseUtils.executeQuery(query);

            query = "select count(*) as totalUpcomingEvents from event where current_timestamp<start_date_time and approved=1";
            let totalUpcomingEvents = yield databaseUtils.executeQuery(query);

            query = "select * from event where current_timestamp<start_date_time and reviewed=0";
            let requested_events_list = yield databaseUtils.executeQuery(query);

            query = "select count(*) as totalRequestedEvents from event where current_timestamp<start_date_time and reviewed=0";
            let totalRequestedEvents = yield databaseUtils.executeQuery(query);

            query = "select clubname from club inner join event on club.clubid=event.clubid where approved=0  and end_date_time>current_timestamp";
            let clubname_list = yield databaseUtils.executeQuery(query);

            query = "select count(id) as totalUser from user";
            let totalUser = yield databaseUtils.executeQuery(query);

            query = "select user.* from user inner join user_role on user.id=user_role.id where user_role.role_id='r2'";
            let coordinator_list = yield databaseUtils.executeQuery(query);

            yield this.render('myevents', {
                registered_events_list: registered_events_list,
                hosted_events_list: hosted_events_list,
                previous_events_list: previous_events_list,
                upcoming_events_list: upcoming_events_list,
                requested_events_list: requested_events_list,
                clubname_list: clubname_list,
                clubnames: clubnames,
                update_events_list: update_events_list,
                coordinator_list : coordinator_list,
                totalUser : totalUser,
                totalRequestedEvents : totalRequestedEvents,
                totalUpcomingEvents : totalUpcomingEvents,
                replyResult : replyResult,
                eventForReply : eventForReply,
                roleVar :roleVar,
                uploadMediaMessage : uploadMediaMessage,
                addMessage : addMessage
            });
        }
        else {
            this.redirect("/login?backRedirectUrl=/events");
        }
    },

    hostEvent: function*(next) {

        let currentUser = this.currentUser;
        if(currentUser){

            let event_name = this.request.body.fields.event_name;
            let venue = this.request.body.fields.venue;
            let start_date_time = this.request.body.fields.start_date_time;
            let end_date_time = this.request.body.fields.end_date_time;
            let abacus_price = this.request.body.fields.abacus_price;
            let non_abacus_price = this.request.body.fields.non_abacus_price;
            let clubname = this.request.body.fields.clubname;
            let imageFiles = this.request.body.files.images;
  
            let pathFile ='/'+ imageFiles.path;
            let certificateTemplate = this.request.body.fields.certificateTemplate;
            let description = this.request.body.fields.description;
            let total_seats = this.request.body.fields.total_seats;
            let coordinator1 = this.request.body.fields.coordinator1;
            let coordinator2 = this.request.body.fields.coordinator2;
            let coordinator3 = this.request.body.fields.coordinator3;
            let coordinator4 = this.request.body.fields.coordinator4;

            let queryString = "select id from user where email in ('%s','%s','%s','%s')";
            let query = util.format(queryString, coordinator1, coordinator2, coordinator3, coordinator4);
            let coordinator_id = yield databaseUtils.executeQuery(query);

            query = "select count(*) as obj from event";
            let result = yield databaseUtils.executeQuery(query);
            let x = +result[0].obj + 1;
            let eventid = event_name + "_" + x;

            if (coordinator1 && coordinator2 && coordinator3 && coordinator4) {
                for (let i = 0; i < 4; i++) {
                    queryString = "insert into event_coordinator(id,eventid) values (%s, '%s')";
                    query = util.format(queryString, coordinator_id[i].id, eventid);
                    yield databaseUtils.executeQuery(query);
                }
            }
            else if (coordinator1 && coordinator2 && coordinator3) {
                for (let i = 0; i < 3; i++) {
                    queryString = "insert into event_coordinator(id,eventid) values (%s, '%s')";
                    query = util.format(queryString, coordinator_id[i].id, eventid);
                    yield databaseUtils.executeQuery(query);
                }
            }
            else if (coordinator1 && coordinator2) {
                for (let i = 0; i < 2; i++) {
                    queryString = "insert into event_coordinator(id,eventid) values (%s, '%s')";
                    query = util.format(queryString, coordinator_id[i].id, eventid);
                    yield databaseUtils.executeQuery(query);
                }
            }
            else if (coordinator1) {
                queryString = "insert into event_coordinator(id,eventid) values (%s, '%s')";
                query = util.format(queryString, coordinator_id[0].id, eventid);
                yield databaseUtils.executeQuery(query);
            }

            let id = this.currentUser.id;

            queryString = "select clubid from club where clubname='%s'";
            query = util.format(queryString, clubname);
            result = yield databaseUtils.executeQuery(query);

            let clubid = result[0].clubid;

            queryString = "insert into event(event_name,eventid,id,venue,start_date_time,end_date_time,abacus_price,non_abacus_price,clubid,event_photo,description,total_seats,avilable_seats,certificateTemplate) values('%s','%s',%s,'%s','%s','%s',%s,%s,%s,'%s','%s',%s, %s,%s)";
            query = util.format(queryString, event_name, eventid, id, venue, start_date_time, end_date_time, abacus_price, non_abacus_price, clubid, pathFile, description, total_seats, total_seats,certificateTemplate);

            yield databaseUtils.executeQuery(query);

            queryString = "insert into event_coordinator values('%s',%s)";
            query = util.format(queryString, eventid, id);
            let coordinator = yield databaseUtils.executeQuery(query);

            this.redirect('/myevents');

        }
        else {
            this.redirect('/login');
        }
    },

    addAdmin:function* (next) {

        queryString = "select role_id from user_role where id=%s";
        query = util.format(queryString,this.currentUser.id);
        let roles = yield databaseUtils.executeQuery(query);

        let currentUserRole = "r3";
        for(let i in roles){

            if(roles[i].role_id < currentUserRole)
                currentUserRole = roles[i].role_id;
        }


        if(currentUserRole){

            let email = this.request.body.email;
            let queryString, query;
            let flag = 1;

            queryString = " select id from user where email='%s'";
            query = util.format(queryString, email);
            let idObj = yield databaseUtils.executeQuery(query);

            queryString = " select role_id from user_role where id=%s";
            query = util.format(queryString, idObj[0].id);

            let previous_role = yield databaseUtils.executeQuery(query);

            for(let i in previous_role){
                if(previous_role[i].role_id==='r1'){
                    flag=0;
                }
            }

            if(flag) {

                for (let i in idObj){
                    queryString = " insert into user_role values(%s,'r1')";
                    query = util.format(queryString, idObj[i].id);
                    let result = yield databaseUtils.executeQuery(query);
                    this.redirect('/myevents?addMessage="AdminAdded Successfully"');
                }
            }
            this.redirect('/myevents');
        }
        else{
            this.redirect('/logout');
        }
    },

    addCoordinator:function* (next) {

        queryString = "select role_id from user_role where id=%s";
        query = util.format(queryString,this.currentUser.id);
        let roles = yield databaseUtils.executeQuery(query);

        let currentUserRole = "r3";
        for(let i in roles){

            if(roles[i].role_id < currentUserRole)
                currentUserRole = roles[i].role_id;
        }


        if(currentUserRole){

            let email = this.request.body.email;
            let queryString, query;
            let flag = 1;

            queryString = " select id from user where email='%s'";
            query = util.format(queryString, email);
            let idObj = yield databaseUtils.executeQuery(query);

            queryString = " select role_id from user_role where id=%s";
            query = util.format(queryString, idObj[0].id);

            let previous_role = yield databaseUtils.executeQuery(query);

            for(let i in previous_role){
                if(previous_role[i].role_id==='r2'){
                    flag=0;
                }
            }

            if(flag) {

                for (let i in idObj){
                    queryString = " insert into user_role values(%s,'r2')";
                    query = util.format(queryString, idObj[i].id);
                    let result = yield databaseUtils.executeQuery(query);
                    this.redirect('/myevents?addMessage="AdminAdded Successfully');
                }
            }
            this.redirect('/myevents');
        }
        else{
            this.redirect('/logout');
        }

    },

    approveOrDiscard: function* (next) {

        let approve=this.request.body.approve;
        let discard=this.request.body.discard;
        let deleteEvent = this.request.body.deleteEvent;
        let currentUser = this.currentUser;
        let eventid=this.request.body.eventid;
        let queryString, query;

        if(currentUser){

            if(approve==='1'){
                queryString = "update event set approved=1 where eventid='%s'";
                query = util.format(queryString, eventid);
                yield databaseUtils.executeQuery(query);

                queryString = "update event set reviewed=1 where eventid='%s'";
                query = util.format(queryString, eventid);
                yield databaseUtils.executeQuery(query);

            }

            if(discard==='1'){
                queryString = "update event set approved=0 where eventid='%s'";
                query = util.format(queryString, eventid);
                yield databaseUtils.executeQuery(query);

            }
            if(deleteEvent==='1'){
                queryString = "update event set approved=0 where eventid='%s'";
                query = util.format(queryString, eventid);
                yield databaseUtils.executeQuery(query);

                queryString = "update event set reviewed=1 where eventid='%s'";
                query = util.format(queryString, eventid);
                yield databaseUtils.executeQuery(query);
            }
            this.redirect('/myevents');
        }
    },

    updateEvent : function* (next) {

        let flag=this.request.body.fields.flag;

        if(flag==="1"){

            let event_name = this.request.body.fields.event_name;
            let eventid = this.request.body.fields.eventid;
            let venue = this.request.body.fields.venue;
            let start_date_time = this.request.body.fields.start_date_time;
            let end_date_time = this.request.body.fields.end_date_time;
            let abacus_price = this.request.body.fields.abacus_price;
            let non_abacus_price = this.request.body.fields.non_abacus_price;
            let clubname = this.request.body.fields.clubname;
            let imageFiles = this.request.body.files.images;
            let pathFile ='/'+ imageFiles.path;
            let certificateTemplate = this.request.body.fields.certificateTemplate;
            let description = this.request.body.fields.description;
            let total_seats = this.request.body.fields.total_seats;

            let queryString = "select clubid from club where clubname = '%s'";
            let query = util.format(queryString, clubname);
            let clubid = yield databaseUtils.executeQuery(query);

            queryString = "update event set event_name='%s',venue='%s',start_date_time='%s',end_date_time='%s',abacus_price=%s,non_abacus_price=%s,clubid=%s,event_photo='%s',description='%s',total_seats=%s, certificateTemplate = %s where eventid='%s'";
            query = util.format(queryString, event_name, venue, start_date_time, end_date_time, abacus_price, non_abacus_price, clubid[0].clubid, pathFile, description, total_seats, certificateTemplate, eventid);
            yield databaseUtils.executeQuery(query);
            this.redirect('/myevents');
        }
        else{

            let eventid = this.request.body.fields.eventid;
            let queryString = "select * from event where eventid='%s'";
            let query = util.format(queryString, eventid);
            let eventDetails = yield databaseUtils.executeQuery(query);
            query = "select * from club";
            let clubnames = databaseUtils.executeQuery(query);

            yield this.render('updateEvent',{
                eventDetails : eventDetails,
                clubnames : clubnames
            });
        }

    },

    uploadMedia: function*(next){

        let Isphoto= this.request.body.fields.Isphoto;
        let Isvideo= this.request.body.fields.Isvideo;
        let query, queryString,pathFile,mediaSize=0;

        let event_id= this.request.body.fields.event_id;

        if(Isphoto==="Isphoto"){

            let imageFiles = this.request.body.files.images;

            if(imageFiles.name===undefined){

                for(let i in imageFiles){

                    mediaSize = imageFiles[i].size;
                    if(mediaSize !== 0) {
                        pathFile = '/' + imageFiles[i].path;
                        queryString = "insert into event_media(file,media_type,eventid) values('%s','photo','%s')";
                        query = util.format(queryString, pathFile, event_id);

                        yield databaseUtils.executeQuery(query);
                    }
                }
            }
            else {

                mediaSize = imageFiles.size;
                if(mediaSize !== 0){
                    pathFile ='/'+ imageFiles.path;
                    queryString = "insert into event_media(file,media_type,eventid) values('%s','photo','%s')";
                    query= util.format(queryString,pathFile,event_id);
                    yield databaseUtils.executeQuery(query);
                }
            }
        }
        else if(Isvideo==="Isvideo"){

            let videoFiles = this.request.body.files.videos;

            if(videoFiles.name===undefined){

                for(let i in videoFiles){
                    mediaSize = videoFiles[i].size;
                    if(mediaSize !== 0) {
                        pathFile = '/' + videoFiles[i].path;
                        queryString = "insert into event_media(file,media_type,eventid) values('%s','video','%s')";
                        query = util.format(queryString, pathFile, event_id);
                        yield databaseUtils.executeQuery(query);
                    }
                }
            }
            else {
                mediaSize = videoFiles.size;

                if(mediaSize !== 0) {
                    pathFile = '/' + videoFiles.path;
                    queryString = "insert into event_media(file,media_type,eventid) values('%s','video','%s')";
                    query = util.format(queryString, pathFile, event_id);
                    yield databaseUtils.executeQuery(query);
                }
            }
        }

        this.redirect('/myevents?uploadMediaMessage=files successfully uploaded');
    },

    attendance : function* (next) {

        let eventid = this.request.body.eventid;
        let userId = this.request.body.userId;
        let queryString,query;

        if(userId[0].length === 1){

            queryString = "update registration set present = 1 where eventid='%s' and id = %s";
            query = util.format(queryString, eventid, userId);
            yield databaseUtils.executeQuery(query);
        }
        else{

            for(let i=0;;i++){

                if(userId[i]){

                    queryString = "update registration set present = 1 where eventid='%s' and id = %s";
                    query = util.format(queryString, eventid, userId[i]);
                    yield databaseUtils.executeQuery(query);
                }
                else{
                    break;
                }
            }
        }
        this.redirect('/myevents?addMessage=Attendance successfully uploaded');
    },

    registeredUsersDetails : function* (next) {

        if(this.currentUser){

            let id = this.currentUser.id;
            let eventid = this.request.query.eventid;
            let queryString, query;
            let flag = 0;

            queryString = "select eventid from event where id=%s";
            query = util.format(queryString, id);
            let hostedEvent = yield databaseUtils.executeQuery(query);

            for(let i in hostedEvent){

                if(hostedEvent[i].eventid === eventid){
                    flag = 1;
                    break;
                }
            }

            if(flag){
                queryString = "select * from user where id in(select id from registration where eventid = '%s')";
                query = util.format(queryString, eventid);
                let registeredUsers = yield databaseUtils.executeQuery(query);

                queryString = "select event_name from event where eventid = '%s'";
                query = util.format(queryString, eventid);
                let event_name = yield databaseUtils.executeQuery(query);

                yield this.render('registeredUsers',{
                    user : registeredUsers,
                    event_name : event_name,
                    eventid :eventid
                });
            }
            else {
                this.redirect('/logout');
            }
        }
        else {
            this.redirect('/login');
        }
        
    }
};
