var http = require('http');
var url = require('url');
var fs = require('fs');
var formidable = require('formidable');
const express = require('express');
const app = express();

http.createServer(function (req, res)
{
	var q = url.parse(req.url, true);
	var filename = "." + q.pathname;
	if (req.url == '/submitted')
	{
		var form = new formidable.IncomingForm();
		form.parse(req, function (err, fields, files)
		{
			res.write('Form submitted');
		});
	}
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
	//app.use('/css', express.static(__dirname + '/css'));
	app.use(express.static('public'));
	fs.readFile(filename, function(err, data)
	{
		if(err)
		{
			res.writeHead(404, {'Content-Type': 'text/html'});
			return res.end("404 Not Found");
		}
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(data);
		res.write('<form>');
			res.write('First Name:');
			res.write('<input type="text" id="first" size="15" autofocus>');
			res.write('<br>');
			res.write('Last Name: ');
			res.write('<input type="text" id="last" size="25">');
			res.write('<br>');
			res.write('Email Address:');
			res.write('<input type="text" id="email" size="25">');
			res.write('<br>');
			res.write('Comments');
			res.write('<br>');
			res.write('<textarea name="comment" rows="10" cols="50">');
			res.write('</textarea>');
			res.write('<br>');
			res.write('<input type="button" value="submit" onclick="emailScript();">');
		res.write('</form>');
		return res.end();
	});
}).listen(8080);