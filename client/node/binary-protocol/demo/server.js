/**
 * Created by tianzx on 2017/7/14.
 */
const header = require('./common/header')
const net = require('net')
const events = require('events')
const util = require('util')
const makeRequestBuffer = require('./common/utils').makeRequestBuffer
const parseResponse = require('./common/utils').parseResponse

const Server = function (port, host,options) {
    events.EventEmitter.call(this)
    this.port = port
    this.host = host
    this.responseBuffer = new Buffer([]);
    options = options || {};
    this.username = ""
    this.password = ""
    return this
}
util.inherits(Server, events.EventEmitter);


Server.prototype.listSasl = function () {
    var buf = makeRequestBuffer(0x20, '', '', '');
    this.write(buf);
}

Server.prototype.saslAuth = function () {
    var authStr = '\0' + this.username + '\0' + this.password;
    var buf = makeRequestBuffer(0x21, '', '', authStr);
    this.write(buf);
}

Server.prototype.appendToBuffer = function (databuf) {
    const old = this.responseBuffer
    this.responseBuffer = new Buffer(old.length + databuf.length)
    old.copy(this.responseBuffer, 0)
    databuf.copy(this.responseBuffer, old.length)
}

Server.prototype.responseHandler = function (databuf) {
    console.log(databuf)
    let response = parseResponse(this.appendToBuffer(databuf))
    while (response) {
        if (response.header.opcode == 0x20) {
            this.saslAuth();
        } else if (response.header.status == 0x20) {
            this.listSasl();
        } else if (response.header.opcode == 0x21) {
            this.emit('authenticated');
        } else {
            this.emit('response', response);
        }
        const respLength = response.header.totalBodyLength + 24
        this.responseBuffer = this.responseBuffer.slice(respLength);
        response = parseResponse(this.responseBuffer);
        console.log(databuf)
    }
}

Server.prototype.write = function(blob) {
    this.sock(function(s) {
        s.write(blob);
    });
}

Server.prototype.sock = function (func) {
    const self = this
    if (!self._sockect) {
        console.log(this.port)
        console.log(this.host)
        self._sockect = net.connect({port:17465,host:'memcached-17465.c1.asia-northeast1-1.gce.cloud.redislabs.com'}, function () {
            // self.once('authenticated', function () {
            //     func(self._sockect)
            // })

            this.on('data', function (databuf) {
                console.log(databuf)
                self.responseHandler(databuf)
            })

            // if (self.username && self.password) {
            //     self.listSasl()
            // } else {
            //     self.emit('authenticated')
            // }

        })
    } else {
        func(self._sockect, false)
    }
}

Server.prototype.close = function () {
    this._socket && this._socket.end();
}

Server.prototype.toString = function () {
    return '<Server ' + this.host + ':' + this.port + '>';
}

exports.Server = Server;