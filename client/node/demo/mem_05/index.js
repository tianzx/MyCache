/**
 * Created by tianzx on 2017/7/12.
 */
const net = require("net")
const util = require('util');
const EventEmitter = require('events');

const crlf = '\r\n'
const crlf_length = crlf.length
const space = ' '

Client = exports.Client = function (port, host) {
    this.port = port
    this.host = host
    this.conn = null
    this.handles = []
    this.buffer = null

}

util.inherits(Client, EventEmitter);

Client.prototype.connect = function (callback) {
    this.conn = net.connect({port: this.port, host: this.host}, () => {

        var self = this;
        this.conn.addListener("connect", function () {
            this.setTimeout(0);          // try to stay connected.
            this.setNoDelay();
            self.emit("connect");
            self.dispatchHandles();
        });

        this.conn.addListener("data", function (data) {
            self.buffer += data;
            // sys.debug(data);
            self.recieves += 1;
            self.handle_received_data();
        });

        this.conn.addListener("end", function () {
            if (self.conn && self.conn.readyState) {
                self.conn.end();
                self.conn = null;
            }
        });

        this.conn.addListener("close", function () {
            self.conn = null;
            self.emit("close");
        });

        this.conn.addListener("timeout", function () {
            self.conn = null;
            self.emit("timeout");
        });

        this.conn.addListener("error", function (ex) {
            self.conn = null;
            self.emit("error", ex);
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
        // console.log("closing")
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
/**
 * set key flags exptime bytes [noreply] value
 * @param key
 * @param value
 * @param callback
 * @param lifetime
 * @param flags
 */
Client.prototype.set = function (key, value, callback, flags = 0, lifetime = 0) {

    this.conn.write('set' + space + key + space + flags + space + lifetime + space + value.length + crlf)
    this.conn.write(value + crlf)
    callback(value)
}