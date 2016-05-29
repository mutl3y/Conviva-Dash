module.exports = function (io) {

    io.on(
        'connection', function (socket) {
            var ip = socket.handshake.address || 'No IP ?';
            socket.on(
                'message', function (data) {

                    console.log(' Incomming io from client ' + ip.address + ':' + ip.port);
                    socket.emit('message', data);
                }
            );
            socket.on(
                'disconnect', function () {
                    console.log('Client disconnected' + ip.address + ':' + ip.port);
                }
            );
        }
    );

    /**
     * @kind                function
     * @description         Adds in authentication to socketjs implementation
     * and ties in with express session management, this is to ensure application
     * security is enforced during socketjs usage
     *
     * todo Socketjs authentication currently disabled
     */
    /*
     var parseCookie = require('connect').utils.parseCookie;
     io.set('authorization', function (data, accept) {

     // check if there's a cookie header
     if (data.headers.cookie) {
     // if there is, parse the cookie
     data.cookie =data.headers.cookie;
     console.log(data.cookie)
     // note that you will need to use the same key to grad the
     // session id, as you specified in the Express setup.
     data.sessionID = data.cookie['connect.sid'];
     console.log(data.sessionID);
     } else {
     // if there isn't, turn down the connection with a message
     // and leave the function.
     return accept('No cookie transmitted.', false);
     }
     // accept the incoming connection
     accept(null, true);
     });
     */

}; // End of exports