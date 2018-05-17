var serveStatic = require('serve-static');
var express = require('express');
var path = require('path');

var app = express()

app.use(serveStatic(path.join(__dirname, '/ArchitectureTree')))
app.listen(3000)

// var livereload = require('livereload');
// var lrserver = livereload.createServer();
// lrserver.watch(__dirname + "/ArchitectureTree");