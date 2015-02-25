var express = require('express');
var request = require('request');

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

/* POST to figure out the desired theme to build out */
router.post('/deployCM', function(req, res) {
	// Retrieve form values
	var theme = req.body.theme;
	console.log(req.body.theme);

	// redirect to the proper theme build out
	if (theme != null && theme === 'Default') {
		// Update the address bar
		res.location("default");

		// redirect to default
		res.redirect("default");
	} else {
		res.location("underconstruction");
		res.redirect("underconstruction");
		// Update the address bar
		//res.location("developer");

		// redirect to developer
		//res.redirect("developer");
	}
});

router.post('/deploydefault', function(req, res) {
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

	//http://localhost:9900/api/tenants?FedMemderId=junk&TenantName=Junk&Address=http://junk.soa.local:9900&ConsoleAddress=http://junk.soa.local:9900/enterpriseapi&Theme=default&Email=administrator@junk.com&Password=password&ContactEmailAddress=no-reply@junk.comFromEmailAddress=no-reply@junk.com

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
    		res.location("success");
    		res.redirect("success");
    		//res.location("deployContent");
			//res.redirect("deployContent");
  		} else {
  			console.log("error/error");
  			console.log(error);
  		};
	});

});

router.post('/deploydeveloper', function(req, res) {
	// Retrieve form values
	var tenantId = req.body.tenantId;
	var defaultConsoleAddress = req.body.defaultConsoleAddress;
	var developerConsoleAddress = req.body.developerConsoleAddress;

	res.location("developerscript");
	res.redirect("developerscript");

});

module.exports = router;
