let serveStatic = require('serve-static');
let connect = require('connect');
let livereload = require('livereload');
let path = require('path');

let server = connect();

server.use(serveStatic(path.join(__dirname, '/architecture_tree')));

server.listen(3000);
let lrserver = livereload.createServer();
lrserver.watch(__dirname + "/architecture_tree");