/**
 * Created by tianzx on 2017/7/12.
 */
const net = require("net")
const crlf = '\r\n'
const crlf_length = crlf.length

Client = exports.Client = function (port, host) {
    this.port = port
    this.host = host
    this.conn = null
    this.handles = []
}

Client.prototype.connect = function (callback) {
    if (!this.conn) {
        this.conn = net.connect({port: this.port, host: this.host}, () => {
            var self = this;
            this.conn.on('data', function (data) {
                console.log('-----data begin------')
                console.log(data.toString());
                console.log('-----data end------')
            });

            this.conn.on("connect", function () {
                console.log('connect')
                this.setTimeout(0);          // try to stay connected.
                this.setNoDelay();
                self.emit("connect");
                self.dispatchHandles();
            });

            this.conn.on('end', function () {
                console.log('-----end------')
                console.log('data fetched');
            });
        })
    }

}

Client.prototype.addHandler = function (callback) {
    this.handles.push(callback);
    console.log(this.conn.readyState)
    if (this.conn.readyState == 'open') {
        console.log(this.conn.readyState)
        this.dispatchHandles();
    }
};

Client.prototype.dispatchHandles = function () {
    for (var i in this.handles) {
        var handle = this.handles.shift();
        console.log(handle)
        if (typeof handle !== 'undefined') {
            handle();
        }
    }
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
    console.log('----set success-----')
}