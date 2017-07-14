/**
 * Created by tianzx on 2017/7/14.
 */
const errors = require('./common/protocol').errors
const Server = require('./server').Server
const makeRequestBuffer = require('./common/utils').makeRequestBuffer
const hashCode = require('./common/utils').hashcode

const Client = function (servers) {
    this.servers = servers
}

// Creates a new client given an optional config string and optional hash of
// options. The config string should be of the form:
//
//   "server1:11211,server2:11211,server3:11211"

Client.create = function (serversStr, options) {
    serversStr = serversStr || "localhost:11211"
    const serversUris = serversStr.split(',')
    const servers = serversUris.map(function (uri) {
        const uriParts = uri.split(':')
        return new Server(uriParts[0], uriParts[1] || 11211)
    })
    return new Client(servers)
}

/**
 * should use consistent hashing and/or allow swaping hashing
 * @param key
 * @returns {*}
 */
Client.prototype.server = function (key) {
    return this.servers[hashCode(key) % this.servers.length]
    // return this.servers[0]
}

Client.prototype.get = function (key, callback) {
    const buf = makeRequestBuffer(0, key, '', '')
    // var serv = this.server(key)
    const serv = this.servers[0]
    console.log(serv)
    // console.log( this.servers)
    serv.once('response', function (response) {
        switch (response.header.status) {
            case  0:
                callback && callback(response.value, response.extras)
                break;
            case 1:
                callback && callback(null, null);
                break;
            default:
                console.log('MemJS GET: ' + errors[response.header.status]);
                callback && callback();
        }
    });
    serv.write(buf);
}

exports.Client = Client;
exports.Server = Server;