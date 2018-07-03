let redisUtils = require('./redisUtils');
let uuid = require('uuid');
let thunkify = require('thunkify');

module.exports = {
    saveUserInSession: function(user, cookies) {
        let sessionId = uuid.v1();
        let sessionObj = {user: user};
        redisUtils.setItemWithExpiry(sessionId,  JSON.stringify(sessionObj), 86400);
        cookies.set("SESSION_ID", sessionId);
    },

    updateUserInSession: function(user, cookies) {
        let sessionId = cookies.get("SESSION_ID");
        let sessionObj = {user: user};
        redisUtils.setItemWithExpiry(sessionId, 86400,  JSON.stringify(sessionObj));
    },

    // addItemInSession: function(key, value, cookies) {
    //     let sessionId = cookies.get("SESSION_ID");
    //     if(sessionId) {
    //
    //         redisUtils.getItemWithCallback(sessionId, function(err, res) {
    //             if(err) {
    //                 logger.logError(err);
    //             }
    //
    //             let sessionObj = JSON.parse(res);
    //             sessionObj[key] = value;
    //             redisUtils.setItemWithExpiry(sessionId,  JSON.stringify(sessionObj), 86400);
    //             cookies.set('email',value);
    //         });
    //     }
    //
    // },
    //
    // // addItemInSession: function(key,value,cookies) {
    // //     let sessionId = "emailSessionId";
    // //     let sessionObj = {key: value};
    // //     redisUtils.setItemWithExpiry(sessionId,  JSON.stringify(sessionObj), 86400);
    // //     cookies.set("email_Session_Id",sessionId);
    // // },
    //
    // getItemFromSession: thunkify(function(key, cookies, callback) {
    //     let sessionId = cookies.get("SESSION_ID");
    //     let value;
    //     if(sessionId) {
    //         redisUtils.getItemWithCallback(sessionId, function(err, res) {
    //             if(err) {
    //                 logger.logError(err);
    //             }
    //             if(res == null) {
    //                 callback(value);
    //             } else {
    //                 callback(err, JSON.parse(res)[key]);
    //             }
    //         });
    //     } else {
    //         callback(value);
    //     }
    // }),

    getCurrentUser: thunkify(function(sessionId, callback) {
        let currentUser;
        if(sessionId) {
            redisUtils.getItemWithCallback(sessionId, function(err, res) {
                if(err) {
                    logger.logError(err);
                }
                if(res == null) {
                    callback(currentUser);
                } else {
                    callback(err, JSON.parse(res).user);
                }
            });
        } else {
            callback(currentUser);
        }
    }),

    deleteSession: function(sessionId) {
        redisUtils.deleteItem(sessionId, function(err, reply) {
            if(err) {
                logger.logError(err);
            }
        });
    }
};
