/**
 * Created by tianzx on 2017/7/12.
 */
const net = require("net")
const util = require('util');
const EventEmitter = require('events');

const crlf = '\r\n'
const crlf_length = crlf.length

Client = exports.Client = function (port, host) {
    this.port = port
    this.host = host
    this.conn = null
    this.handles = []
}

util.inherits(Client, EventEmitter);

Client.prototype.connect = function (callback) {
    this.conn = net.connect({port: this.port, host: this.host}, () => {
        var self = this;
        /**
         * listen on
         */
        this.conn.on('data', function (data) {
            console.log(data.toString());
        });

        this.conn.on('end', function () {
            console.log('-----end------')
            console.log('欢迎下次光临')
            console.log('-----end------')
        });

        this.conn.addListener("close", function () {
            self.conn = null;
            self.emit("close");
        });
    })
}
/**
 *
 */
Client.prototype.close = function () {
    console.log('-----close being------')
    console.log(this.conn.readyState)
    if (this.conn && this.conn.readyState == "opening") {
        console.log("closing")
        this.conn.end();
        // this.conn = null;
    }
    console.log('-----close ends------')
};

/**
 * memcache get function
 */
Client.prototype.query = function (query, type, callback) {
    this.conn.write(query + crlf);
}

Client.prototype.get = function (key, callback) {
    return this.query('get ' + key, 'get', callback);
};

Client.prototype.set = function (key, value, callback, lifetime, flags) {
    /**
     * memcache set function
     */
    this.conn.write('set ' + key + ' 0 0 ' + value.length + '\r\n')
    this.conn.write(value + '\r\n')
    // console.log('----set success-----')
    // console.log(callback)
    callback(value)
}