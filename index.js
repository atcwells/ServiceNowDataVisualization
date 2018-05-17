let serveStatic = require('serve-static');
let express = require('express');
let livereload = require('livereload');
let path = require('path');

let app = express();

app.use(serveStatic(path.join(__dirname, '/ArchitectureTree')))

app.listen(3000)
let lrserver = livereload.createServer();
lrserver.watch(__dirname + "/ArchitectureTree");