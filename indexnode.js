var http = require('http'); //
var url = require('url'); //
var fs = require('fs'); //
//var formidable = require('formidable'); 
//var cssHeaders = {'Content-Type': 'text/css'};
var nodemailer = require('nodemailer');//
//var mongo = require('mongodb');
//const cssStuff = {'.css': 'text/css'};
const express = require('express');//
const path = require('path');//

const qs = require('querystring'); //
//no ffv
const uuidv1 = require('uuid/v1');//

const mimeTypes = 
{
  '.html': 'text/html',
  '.htm': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

var app = express();//
app.use(express.static('public'));//
var port = process.env.PORT || 8080;

http.createServer(app).listen(port);

	console.log("Made it to createServer");  
	//var q = url.parse(req.url, true);
	//var filename = "." + q.pathname;
	console.log('still here');
	app.post('/index.html', function(req, res)
	{
		console.log('made it inside app.post');
		var body = '';
		var testValidity = false;
		req.on('data', function(chunk)
		{
			body+=chunk.toString();
		});
		req.on('end', function() 
		{
			console.log('testing validity');
			testValidity=ffv.validateForm(body);
			if(testValidity == true)
			{
				console.log('test validity = true');
				var ts = Date.now();
				var parsed = qs.parse(body);
				fs.appendFile('flatfileDB.txt', convertToString(parsed, ts), function(error)
				{
					if(error)
					{
						console.log('Error writing to DB');
						throw error;
					}
					console.log('wrote to DB');
				});
				sendEmail(parsed['email'], ts);
				res.writeHead(301, {'Content-Type': 'text/plain', Location: '/'});
				res.end();
			}
			else
			{
					console.log('test validity = false');
					res.writeHead(301, {'Content-Type': 'text/plain', Location: '/'});
					res.end(testValidity);
			}	
		});
	});	
	// This handles all GET requests
app.get('*', function (req, res) {
  /* 
    This block merely skips over the call for the 
    favicon, as I'm not dealing with it yet.
  */
  if (req.url === '/favicon.ico') {
    //res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    return res.end();
  }
  /* 
    `url.parse(urlString)` returns a URL object
    `url.pathname` Gets and sets the path portion of the URL.
  */
  var pathname = url.parse(req.url).pathname;
  // Sets up a default route to go directly to the "front page"
  pathname = ( pathname === '/' || pathname === '' ) ? '/index.htm' : pathname;

  /*
    `path.extname()` returns the extension of the path, from the last occurrence of the . (period) character to end of string in the last portion of the path. If there is no . in the last portion of the path, or if there are no . characters other than the first character of the basename of path (see path.basename()) , an empty string is returned.
  */
  var ext = path.extname(pathname);
  /*
    "fs.readFile(path, callback)" asynchronously reads the entire contents of a file.
  */
  fs.readFile(__dirname + pathname, function(err, data){
    // Handle any type of error first
	// __dirname gives you the path of the currently running file
    if (err) {
      if(ext){
      //  res.writeHead(404, {'Content-Type': mimeTypes[ext]});
      }
      else{
        res.writeHead(404, {'Content-Type': 'text/html'});
      }
      return res.end("404 Not Found");
    }  
    // If `ext` is not an empty string, deal with the MIME type
    if(ext){
      //res.writeHead(200, {'Content-Type': mimeTypes[ext]});
    }
    else{
      // This is a catch all
      res.writeHead(200, {'Content-Type': 'text/html'});
    }
    res.write(data);
    return res.end();
  });
});
	/*
	if (req.url == '/submitted')
	{
		console.log("made it to submitted");
		res.write("Thank you!");
		var form = new formidable.IncomingForm();

		form.parse(req, function (err, fields, files)
		{
			res.write('Form submitted');
		});

	}
	*/
	///CSS SOLUTION FROM ONLINE
	/*
	function css(request, response)
	{
		if(request.url == '/project.css')
		{
			response.writeHead(200, {'Content-type': 'text/css'});
			var fileContents = fs.readFileSync('./project.css', {encoding: 'utf8'});
			response.write(fileContents);
		}
	} */
	///END CSS SOLUTION
	//app.use(express.static(path.join(__dirname, 'public')));

	//app.use('/static', express.static('public'));
	
	//app.use(express.static('public'));
	
	// Function merely converts data from an object to a string.
	function convertToString(dirty, ts) {
		dirty.id = uuidv1();
		dirty.created_at = Date();
		dirty.reference_id = ts;
		return JSON.stringify(dirty);
	} // end convertToString
	
	function sendEmail(email, reference)
	{
		//email stuff
		var transporter = nodemailer.createTransport({
			service: 'outlook',
			auth:{
				user: 'jessicastrunk@siu.edu',
				pass: '?Schizo-Lesbo1996'
			}
		});
		var mailOptions = {
			from: 'jessicastrunk@siu.edu',
			to: email,
			subject: 'user registration complete',
			text: 'that was easy'
		};
				//console.log(files.email.name);
				
		// This block is used to test the mailing server
				
			transporter.verify(function(error, success) {
				if (error) {
					console.log('************',error);
				} 
				else {
					console.log('Server is ready to take our messages');
				}
			});
			console.log('got to send mail call');
			transporter.sendMail(mailOptions, function(error, info){
				if(error){
					console.log(error);
				}else{
					console.log('Email sent: ' + info.response);
				}
			});
		/*
		transporter.sendMail(mailOptions, function(err, info)
		{
			if(err)
			{
				console.log(err);
			}
			else
			{
				console.log('Email sent: ' + info.response);
			}
		});
		*/	
	} //end sendMail
	
	/*
	fs.readFile(filename, function(err, data)
	{
		if(err)
		{
			res.writeHead(404, {'Content-Type': 'text/html'});
			return res.end("404 Not Found");
		}
		res.writeHead(200, cssHeaders);
		//renderer.css(response);
	*/
		
/*		
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(data);
		res.write('<form action="submitted" method="post" enctype="multipart/form-data">');
			res.write('First Name:');
			res.write('<input type="text" id="first" size="15" autofocus>');
			res.write('<br>');
			res.write('Last Name: ');
			res.write('<input type="text" id="last" size="25">');
			res.write('<br>');
			res.write('Email Address:');
			res.write('<input type="email" name="email" size="25">');
			res.write('<br>');
			res.write('Comments');
			res.write('<br>');
			res.write('<textarea name="comment" rows="10" cols="50">');
			res.write('</textarea>');
			res.write('<br>');
			res.write('<input type="submit">');
		res.write('</form>');
		return res.end();
		*/
	//});
