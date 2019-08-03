var http = require('http');
var url = require('url');
var fs = require('fs');

var rs = fs.createReadStream('./demofile.txt');

var events = require('events');
var eventEmitter = new events.EventEmitter();

//npm files
var formidable = require('formidable');
var nodemailer = require('nodemailer');

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
	to: 'jecastrunk@gmail.com',
	subject: 'user registration complete',
	text: 'that was easy'
};
//////SENDS EMAIL/////
//transporter.sendMail(mailOptions, function(error, info){
//	if(error){
//		console.log(error);
//	}else{
//		console.log('Email sent: ' + info.response);
//	}
//});
//end email stuff
	
rs.on('open', function()
{
	console.log('The file is open');
});

var myEventHandler = function()
{
	console.log('I hear a scream!');
}

//Assign the event handler to an event:
eventEmitter.on('scream', myEventHandler);

//Fire the 'scream' event:
eventEmitter.emit('scream');

http.createServer(function (req, res)
{
	if (req.url == '/fileupload')
	{
		var form = new formidable.IncomingForm();
		form.parse(req, function (err, fields, files)
		{
			var oldpath = files.filetoupload.path;
			var newpath = 'C:/Users/JecaS/Documents/CS350-491/Jessica-ConnerStrunk-Project4/' + files.filetoupload.name;
			fs.rename(oldpath, newpath, function (err)
			{
				if(err) throw err;
				res.write('File uploaded and moved');
		

				res.end();
			});

		});
	} else 
	{
			res.write('made it to url parse');
			var q = url.parse(req.url, true);
			var filename =  "." + q.pathname;
			fs.readFile(filename, function(err, data)
			{
				if(err)
				{
					res.writeHead(404, {'Content-Type': 'text/html'});
					return res.end("404 Not Found");
				}

	});
		
		/* FORM TUTORIAL
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
rite('<input type="file" name="filetoupload"><br>');
		res.write('<input type="submit">');
		res.write('</form>');
		return res.end();
		*/
	}
	/*
	var q = url.parse(req.url, true);
	var filename =  "." + q.pathname;
	fs.readFile(filename, function(err, data)
	{
		if(err)
		{
			res.writeHead(404, {'Content-Type': 'text/html'});
			return res.end("404 Not Found");
		}

	});
	*/
}).listen(8080);
