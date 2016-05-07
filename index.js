const _pusher = require('./src/pusher.js');
const updateInterval = 10; // seconds

setInterval( _pusher.pushUpdate, updateInterval*1000 );
