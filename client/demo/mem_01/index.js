/**
 * Created by tianzx on 2017/7/11.
 */
var net = require("net");

var client = net.connect({port: 11211, host: "localhost"}, function () {
    console.log('connected');

    client.write('get key \r\n');

    client.on('data', function (data) {
        console.log(data.toString());
    });

    client.on('end', function () {
        console.log('data fetched');
    });
});