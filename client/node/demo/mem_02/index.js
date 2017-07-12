/**
 * Created by tianzx on 2017/7/11.
 */
const net = require("net");

Client = exports.Client = function(port, host){
    this.port = port
    this.host = host
}

Client.prototype.connect = function () {
    const client = net.connect({port:this.port,host:this.host},function () {
        console.log('connected');
        /**
         * memcache set function
         */
        client.write('set key 0 0 2 \r\n')
        client.write('br\r\n')
        /**
         * memcache get function
         */
        client.write('get key \r\n');
        //OR other commands + "\r\n"

        client.on('data', function (data) {
            console.log('-----data begin------')
            console.log(data.toString());
            console.log('-----data end------')
        });

        client.on('end', function () {
            console.log('-----end------')
            console.log('data fetched');
        });
    })
}
