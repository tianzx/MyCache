/**
 * Created by tianzx on 2017/7/14.
 */
const net = require("net");
const fs = require("fs")
const client = net.connect({port: 11211, host: "192.168.199.151"}, function () {
    console.log('connected');

    // client.write('get key \r\n');
    for (var i = 0; i < 100; i++) {
        fs.readFile('./input.txt', function (err, data) {
            console.log("err ...." + err)
            if (err) {
                return console.error(err);
            }
            // console.log("异步读取: " + data.toString());
            console.log("data " + data)
            client.write(data)
            console.log("send finish")
        });
    }

    client.on('data', function (data) {
        // console.log("receive data")
        // console.log(data);
    });

    client.on('end', function () {
        console.log('data fetched');
    });
});