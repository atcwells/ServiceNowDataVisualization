var browserify = require('browserify');
var fs = require('fs');

browserify()
    .add('architecture_tree/js/architecture_tree/app.js')
    .transform('brfs')
    .bundle()
    .pipe(fs.createWriteStream('architecture_tree/dist/index.js'));