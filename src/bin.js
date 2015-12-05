//require('../.vscode/server.babel'); // babel registration (runtime transpilation for node)

var fs = require('fs');

var babelrc = fs.readFileSync('./.babelrc');

try {
    config = JSON.parse(babelrc);
} catch (err) {
    console.error('==>     ERROR: Error parsing your .babelrc.');
    console.error(err);
}

require('babel-core/register')(config);
require('./Server.js');