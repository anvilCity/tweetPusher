const _pusher = require('./src/pusher.js');
const _updateInterval = 4; // seconds

_pusher.pushUpdate();
setInterval( _pusher.pushUpdate, _updateInterval*1000 );
