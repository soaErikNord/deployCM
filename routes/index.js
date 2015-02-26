var express = require('express');
var request = require('request');
var mysql = require('mysql');

var developerTheme = false;
var defaultTheme = false;

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* open the application */
router.get('/theme', function(req, res) {
	res.render('theme', { title: 'Deploy Community Manager' })
});

router.get('/default', function(req, res) {
	res.render('default', { title: 'Deploy Default Theme' })
});

router.get('/developer', function(req, res) {
	res.render('developer', { title: 'Deploy Developer (SimpleDev) Theme' })
});

router.get('/deployContent', function(req, res) {
	res.render('deployContent', { title: 'Deploy Default Content' })
});

router.get('/developerscript', function(req, res) {
	res.render('developerscript', { title: 'Developer Script' })
});

router.get('/success', function(req, res) {
	res.render('success', { title: 'Success' })
});

router.get('/underconstruction', function(req, res) {
	res.render('underconstruction', { title: 'Under Construction' })
});

router.get('/themeerror', function(req, res) {
	res.render('themeerror', { title: 'Error!!!!!!!' })
});

/* POST to figure out the desired theme to build out */
router.post('/deployCM', function(req, res) {
	console.log('Enter /deployCM');
	// Retrieve form values
	defaultTheme = false;
	developerTheme = false;

	var theme = req.body.theme;
	console.log(req.body.theme);

	var length = theme.length;
	for (var i = 0; i < length; i++) {
		var themeType = theme[i];
		if (themeType.length ===1) {
			themeType = theme;
		}
		console.log('themeType==' + themeType);
		if (themeType === 'Default') {
			console.log('Setting Default to true');
			defaultTheme = true;
		};
		if (themeType === 'Developer') {
			console.log('Setting Developer to true');
			developerTheme = true;
		};
	};

	if (defaultTheme) {
		// Update the address bar
		res.location("default");

		// redirect to default
		res.redirect("default");
	};
	if (developerTheme) {
		// Update the address bar
		res.location("developer");

		// redirect to developer
		res.redirect("developer");
	};
	console.log('Exit /deployCM');
});

router.post('/deploydefault', function(req, res) {
	console.log('Enter /deploydefault');
	// Variables
	var api = '/api/tenants';
	var contentType = 'application/x-www-form-urlencoded';

	// Retrieve form values
	var url = req.body.url;
	var tenantName = req.body.tenantName;
	var tenantId = req.body.tenantId;
	var address = req.body.address;
	var consoleAddress = req.body.consoleAddress;
	var email = req.body.email;
	var password = req.body.password;
	var contactEmailAddress = req.body.contactEmailAddress;
	var fromEmailAddress = req.body.fromEmailAddress;

	var path = url + api + "?FedMemderId=" + tenantId + "&TenantName=" + tenantName + "&Address=" + address + "&ConsoleAddress=" + consoleAddress + "&Theme=default&Email=" + email + "&Password=" + password + "&ContactEmailAddress=" + contactEmailAddress + "&FromEmailAddress=" + fromEmailAddress;

	console.log(path);

	var options = {
		url: path,
		method: "POST",
		headers: {
			'Content-Type': contentType
		}
	};

	request(options, function (error, response, body) {
  		if (!error && response.statusCode == 200) {
    		console.log(body); // Show the HTML for the Google homepage.
    		console.log(response.statusCode);
    		if (developerTheme) {
    			res.location("developer");
    			res.redirect("developer");
    		} else {
    			res.location("success");
    			res.redirect("success");
    		}
    		//res.location("deployContent");
			//res.redirect("deployContent");
  		} else {
  			console.log("error/error");
  			console.log(error);
  			res.location("themeerror");
			res.redirect("themeerror");
  		};
	});
	console.log('Exit /deploydefault');
});

router.post('/deploydeveloper', function(req, res) {
	console.log('Enter /deploydeveloper');
	// Retrieve form values
	var tenantId = req.body.tenantId;
	var defaultHostName = req.body.defaultHostName;
	var developerHostName = req.body.developerHostName;
	var developerConsoleAddress = req.body.developerConsoleAddress;

	var virtualHost = defaultHostName + ',' + developerHostName;

	var insertQuery = 'INSERT INTO TENANT_THEMES (TENANTID, THEME, VIRTUALHOST, CONSOLEADDRESS, THEMEIMPL) VALUES (' + tenantId + ', \'developer\', \'' + virtualHost + '\', \'' + developerConsoleAddress + '\', \'simpledev\');';
	console.log('Insert Query: ', insertQuery);
	var updateQuery = 'UPDATE TENANTS SET VIRTUALHOST=\'' + virtualHost + '\' WHERE TENANTID=' + tenantId + ';';
	console.log('Update Query: ', updateQuery);

	var connection = mysql.createConnection({
		host	: req.body.dbHost,
		user	: req.body.dbUser,
		password: req.body.dbPassword,
		database: req.body.dbName
	});

	connection.connect();

	var success = false;

	connection.query(insertQuery, function(err, rows, fields) {
		if (!err) {
			console.log('Insert Query successful!');
			success = true;
			console.log('Success===', success);
		} else {
			console.log('Error while inserting data.', err);
		}
	});

	connection.query(updateQuery, function(err, rows, fields) {
		if (!err) {
			console.log('Update Query successful!');
			success = true;
			console.log('Success===', success);
		} else {
			console.log('Error while updating data.', err);
		}

		done(success, res);
	});

	connection.end();

	//console.log('Success===', success);
	//if (success) {
		//res.location("success");
		//res.redirect("success");
	//} else {
		//res.location("themeerror");
		//res.redirect("themeerror");
	//}
	
	console.log('Exit /deploydeveloper');
});

function done(success, res) {
		console.log('Success===', success);
		if (success) {
			res.location("success");
			res.redirect("success");
		} else {
			res.location("themeerror");
			res.redirect("themeerror");
		}
	};

module.exports = router;
