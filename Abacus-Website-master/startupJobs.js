//let databaseUtils = require('./services/databaseUtils');
//let redisUtils = require('./services/redisUtils');
//let logger = require('./logger');
//let Constants = require('./constants');
//let fs = require('fs');

//function storeEventInRadis(){
//	let query="select * from event";
//	  databaseUtils.executePlainQuery(query, function(err, response) {
//        if(err) {
//            logger.logError(err);
//        } else {
//
//            redisUtils.setItem(Constants.redisDataKeys.USER_LIST, JSON.stringify(response));
//        }
//    })
//}
//storeEventInRadis();

var schedule = require('node-schedule');
const { exec } = require('child_process');

schedule.scheduleJob('*/60 * * * *', function(){
	var mysqlDump = require('mysqldump');
	var datetime = require('node-datetime');
	var dt = datetime.create();
	var formatted = dt.format('d-m-Y H:M:S');
	mysqlDump({
		host: '127.0.0.1',
		user: 'root',
		password: 'secret',
		database: 'abacus',
		dest:'DBScripts/'+formatted
	},function(err){
		console.log(err);
	});
});

//schedule.scheduleJob('*/59 * * * * *', function(){
//	exec('git add .;git commit -m "updated data";git push;', (err, stdout, stderr),callback => {
//		output = `stdout: ${stdout}`;
//		Error = `stderr: ${stderr}`;
//		console.log(output);
//		console.log(Error);
//	});
//});
