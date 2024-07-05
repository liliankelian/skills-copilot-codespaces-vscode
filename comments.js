// create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var qs = require('querystring');
var comments = [];

// create server
http.createServer(function(req, res) {
    // parse url
    var pathname = url.parse(req.url).pathname;
    // parse query
    var query = url.parse(req.url).query;
    // parse post data
    var postData = '';
    req.setEncoding('utf8');
    req.addListener('data', function(postDataChunk) {
        postData += postDataChunk;
    });
    req.addListener('end', function() {
        var params = qs.parse(postData);
        // route
        if (pathname === '/') {
            // read index.html
            fs.readFile('./index.html', 'utf-8', function(err, data) {
                if (err) {
                    throw err;
                }
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            });
        } else if (pathname === '/comment') {
            // add comment
            comments.push(params.comment);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write('success');
            res.end();
        } else if (pathname === '/getComments') {
            // get comments
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write(JSON.stringify(comments));
            res.end();
        } else {
            // read other files
            fs.readFile(path.join('./', pathname), 'utf-8', function(err, data) {
                if (err) {
                    res.writeHead(404, {'Content-Type': 'text/plain'});
                    res.write('404 Not Found');
                    res.end();
                } else {
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.write(data);
                    res.end();
                }
            });
        }
    });
}).listen(8080);
console.log('Server running at http://');