/**
 * Created by tianzx on 2017/7/11.
 */
const net = require("net");

Client = exports.Client = function (port, host) {
    this.port = port
    this.host = host
    this.conn = null
}

Client.prototype.connect = function () {
    this.conn = net.connect({port: this.port, host: this.host}, () => {
        console.log('connected');
        /**
         * memcache set function
         */
        this.conn.write('set key 0 0 6 \r\n')
        this.conn.write('tianzx\r\n')
        /**
         * memcache get function
         */
        // client.write('get key \r\n');
        //OR other commands + "\r\n"

        this.conn.on('data', function (data) {
            console.log('-----data begin------')
            console.log(data.toString());
            console.log('-----data end------')
        });

        this.conn.on('end', function () {
            console.log('-----end------')
            console.log('data fetched');
        });
    })
}

Client.prototype.getKey = function (key, callback) {
    this.conn.write('get ' + key + '\r\n');
    // return this.query('get ' + key, 'get', callback);
};