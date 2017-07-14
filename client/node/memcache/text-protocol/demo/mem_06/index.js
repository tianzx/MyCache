/**
 * Created by tianzx on 2017/7/12.
 */
const net = require("net")
const util = require('util');
const EventEmitter = require('events');

const crlf = '\r\n'
const crlf_length = crlf.length
const space = ' '
const error_replies = ['ERROR', 'NOT_FOUND', 'CLIENT_ERROR', 'SERVER_ERROR'];

Client = exports.Client = function (port, host) {
    this.port = port
    this.host = host
    this.conn = null
    this.handles = []
    this.buffer = []
    this.callbacks = []
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
            console.log(new Buffer(self.buffer))
            console.log(self.buffer)
            // console.log(self.buffer)
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
Client.prototype.handle_received_data = () => {
    // console.log(this.buffer)
    // while (this.buffer.length > 0) {
    //     determine_reply_handler(this.buffer)
    // }
}
Client.prototype.determine_reply_handler = function (buffer) {
    let crlf_at = buffer.indexOf(crlf);
    if (crlf_at === -1) {
        return null;
    }
    for (var error_idx in error_replies) {
        var error_indicator = error_replies[error_idx];
        if (buffer.indexOf(error_indicator) == 0) {
            return this.handle_error(buffer);
        }
    }
    // call the handler for the current message type
    var type = this.callbacks[0].type;
    if (type) {
        return this['handle_' + type](buffer);
    }

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
    this.callbacks.push({type: type, fun: callback});
    this.sends++;
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
};


Client.prototype.handle_error = function (buffer) {
    line = readLine(buffer);
    return [null, (line.length + crlf_len), line];
};
Client.prototype.handle_get = function (buffer) {
    var next_result_at = 0;
    var result_value = null;
    var end_indicator_len = 3;

    if (buffer.indexOf('END') == 0) {
        return [result_value, end_indicator_len + crlf_len];
    } else if (buffer.indexOf('VALUE') == 0) {
        first_line_len = buffer.indexOf(crlf) + crlf_len;
        var end_indicator_start = buffer.indexOf('END');
        result_len = end_indicator_start - first_line_len - crlf_len;
        result_value = buffer.substr(first_line_len, result_len);
        return [result_value, first_line_len + parseInt(result_len, 10) + crlf_len + end_indicator_len + crlf_len]
    } else {
        var first_line_len = buffer.indexOf(crlf) + crlf_len;
        var result_len = buffer.substr(0, first_line_len).split(' ')[3];
        result_value = buffer.substr(first_line_len, result_len);

        return [result_value, first_line_len + parseInt(result_len) + crlf_len + end_indicator_len + crlf_len];
    }
};
readLine = function (string) {
    var line_len = string.indexOf(crlf);
    return string.substr(0, line_len);
};