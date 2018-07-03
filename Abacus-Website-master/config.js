module.exports={
	env:'dev',
	applicationUrl: 'http://35.200.139.124',
	port:{
		http:80,
        https: 443
	},
	logginMode :'error',
	redisConfig:{
		host:'127.0.0.1',
		port:6379
	},
	databaseConnection :{
		connectionLimit:100,
		host:'127.0.0.1',
		user :'root',
		password :'secret',
		database: 'abacus'
	},
	enableGoogleAnalyticsTracking:false
};
