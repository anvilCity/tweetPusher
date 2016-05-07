const _pusher = require('./src/pusher.js');
const _updateInterval = 10; // seconds
_pusher.pushUpdate();
setInterval( _pusher.pushUpdate, _updateInterval*1000 );
