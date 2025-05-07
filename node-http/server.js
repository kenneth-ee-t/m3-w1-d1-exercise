var http = require('http');
var path = require('path'); //this module provides utilities for working with file and directory paths. It is used to handle and manipulate file paths in a cross-platform way.
var fs = require('fs'); //this module provides an API for interacting with the file system. It allows you to read and write files, create directories, and perform other file system operations.    
var hostname = `localhost`;
var port = 3000;

var server = http.createServer(function(req, res){
    console.log(`request for ${req.url} by method ${req.method}`); //this will print the headers of the request to the console. This is useful for debugging and understanding what the client is sending to the server.
    if (req.method === 'GET') {
        var fileUrl = req.url;
        if (fileUrl === '/') {
            fileUrl = '/index.html';
        }
        const filePath = path.resolve(`./public${fileUrl}`); //this will resolve the path to the file based on the current working directory and the provided relative path.
        const fileExt = path.extname(filePath); //this will extract the file extension from the file path.
        
        if (fileExt === '.html') {
            fs.access (filePath, function(err) {
               if (err) {
                   res.statusCode = 404;
                   res.setHeader('Content-Type', 'text/html');
                   res.end(`<html><body><h1>Error 404: ${fileUrl} file not found</h1></body></html>`);
                return;
               }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                
                fs.createReadStream(filePath).pipe(res); //this will create a readable stream from the file and pipe it to the response object. This means that the file will be read and sent to the client in chunks, rather than loading the entire file into memory at once.
            });
         } else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/html');
                res.end(`<html><body><h1>Error 404: ${fileUrl} file not found</h1></body></html>`);
            }
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end(`<html><body><h1>Error 404: ${req.method} not supported</h1></body></html>`);
        }
    });
