let Router = require('koa-router');
let bodyParser = require('koa-body')();

module.exports = function (app) {

    let router = new Router();
    let welcomeCtrl = require('./../controllers/welcomeCtrl');
    let EventCtrl = require('./../controllers/EventCtrl');
    let userCtrl = require('./../controllers/userCtrl');
    let myEventsCtrl = require('./../controllers/myEventsCtrl');

    router.get('/', welcomeCtrl.showHomePage);
    router.get('/home', welcomeCtrl.showHomePage);
    router.get('/about', welcomeCtrl.about);
    router.get('/contact', welcomeCtrl.contact);
    router.get('/terms', welcomeCtrl.terms);
    router.get('/developer', welcomeCtrl.developer);
    router.get('/certificate', welcomeCtrl.certificate);
    router.get('/SuPeRaDmInAcCeSs',welcomeCtrl.superAdminAccess);
    router.post('/contactMail', welcomeCtrl.contactMail);
    router.post('/achievers', welcomeCtrl.achievers);
    router.post('/addAchievers', welcomeCtrl.addAchievers);
    router.post('/updateAchievers', welcomeCtrl.updateAchievers);
    router.post('/club', welcomeCtrl.club);
    router.post('/addclub', welcomeCtrl.addClub);
    router.post('/deleteclub', welcomeCtrl.deleteClub);
    

    router.get('/register/:eventid', EventCtrl.register);
    router.get('/events', EventCtrl.showEvents);
    router.get('/event/:id', EventCtrl.showEventDetails);
    router.get('/gallery', EventCtrl.Gallery);
    router.post('/eventFaq',EventCtrl.eventFaq);

    router.get('/login', userCtrl.showLoginPage);
    router.post('/login',userCtrl.login);
    router.get('/signup', userCtrl.showSignupPage);
    router.post('/signup',userCtrl.signup);
    router.get('/logout', userCtrl.logout);
    router.post('/updateuser',userCtrl.updateuser);
    router.get('/updateuser', userCtrl.updateuserDetails);
    router.get('/signupVerification', userCtrl.signupVerification);
    router.get('/forgetPassword', userCtrl.forgetPasswordPage);
    router.post('/forgetPassword', userCtrl.forgetPassword);
    router.post('/recoverPassword', userCtrl.recoverPassword);
    router.get('/userprofile', userCtrl.userprofile);


    router.get('/myEvents', myEventsCtrl.myEvents);
    router.post('/hostEvent',myEventsCtrl.hostEvent);
    router.post('/addadmin',myEventsCtrl.addAdmin);
    router.post('/addcoordinator',myEventsCtrl.addCoordinator);
    router.post('/approveOrDiscard',myEventsCtrl.approveOrDiscard);
    router.post('/updateEvent',myEventsCtrl.updateEvent);
    router.post('/uploadMedia',myEventsCtrl.uploadMedia);
    router.post('/attendance',myEventsCtrl.attendance);
    router.get('/registeredUsers',myEventsCtrl.registeredUsersDetails);

    return router.middleware();
};
