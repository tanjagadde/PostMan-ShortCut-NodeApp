var Todo = require('./models/todo');
var textSearch = require('mongoose-text-search');

function getTodos(res) {
	Todo.find(function(err, todos) {

		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err)
			res.send(err)

		res.json(todos); // return all todos in JSON format
	});
};
var http = require('http');

var postCopyData =
	module.exports = function(app) {

		// api ---------------------------------------------------------------------
		// get all todos
		app.get('/api/todos', function(req, res) {

			// use mongoose to get all todos in the database
			getTodos(res);
			//var body='';

		});
		// create todo and send back all todos after creation
		app.post('/api/todos', function(req, res) {

			var body = '';
			var options = '';
			var postdata = '';
			var user = '';
			var domain = '';
			var fromID = '';
			console.log('req body is' + req.body.text)
			var reqString = req.body.text
			var delimiterSplit = reqString.split('|');
			console.log('req body is varrr  delimiter' + delimiterSplit);
			var copierID = delimiterSplit[1];
			var copyId = delimiterSplit[2]

			if (reqString == "PostCopier") {
				options = {
					host: 'localhost',
					port: '8080',
					path: '/copiers',
					method: 'POST'
				};
				user = 'awesomeTestingUser' + Math.floor((Math.random() * 10) + 1);
				domain = 'coolDomain' + Math.floor((Math.random() * 100) + 1);
				postdata = JSON.stringify({
					'name': user,
					'domain': domain,
					'active': 'true'
				});

			} else if (reqString == "PostCopy") {
				options = {
					host: 'localhost',
					port: '8080',
					path: '/copies',
					method: 'POST'
				};
				fromID = '54f9eb08e4b072b4df550c35';
				postdata = '{"from": {"section": {"id": "' + fromID + '"}}}'
			} else if (reqString.indexOf('PostCopyStatus') > -1) {
				var fullPath = '/copies/' + copyId + '/copierstatus/' + copierID;
				options = {
					host: 'localhost',
					port: '8080',
					path: fullPath,
					method: 'PUT'
				};
				postdata = '{"status": "processing","eta": "2014-08-15T01:08:41.489Z","progress": 13,"copiedResourcesCount": 71}'

			} else if ((reqString.indexOf('PostCopyResource') > -1)) {

				var fullPath = '/copies/' + copyId + '/copierstatus/' + copierID + '/copiedresources/batch';
				console.log("path is " + fullPath)
				options = {
					host: 'localhost',
					port: '8080',
					path: fullPath,
					method: 'POST'
				};

				postdata = '[{"from": "http://self-link-to-perf-resource","to": "http://self-link-to-perf-resource"},{"from": "http://apigee-self-link-to-perf-resource","to": "http://apigee-self-link-to-perf-resource"}]'
			}
			//Now we're going to set up the request and the callbacks to handle the data
			var request = http.request(options, function(response) {
				//When we receive data, we want to store it in a string
				response.on('data', function(chunk) {
					body += chunk;
				});
				//On end of the request, run what we need to
				response.on('end', function() {
					console.log(body);
					//res.json(body);
					Todo.create({
						text: body,
						done: false
					}, function(err, todo) {
						if (err)
							res.send(err);

						getTodos(res);
						//res.end();
					});

				});
			});

			//Now we need to set up the request itself. 
			//This is a simple sample error function
			
			// //Write our post data to the request
			request.write(postdata);
			// console.log("request is "+request)
			// //End the request.
			request.end();
			//create a todo, information comes from AJAX request from Angular

		});

		// delete a todo
		app.delete('/api/todos/:todo_id', function(req, res) {
			Todo.remove({
				_id: req.params.todo_id
			}, function(err, todo) {
				if (err)
					res.send(err);

				getTodos(res);
			});
		});

		// application -------------------------------------------------------------
		app.get('*', function(req, res) {
			res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
		});
	};