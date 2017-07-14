/**
 * Created by tianzx on 2017/7/14.
 */

const net = require('net')
const config = {
    port: 11211,
    host: '192.168.199.151'
}
const server = net.createServer(
    function (socket) {
        var i = 0
        socket.on('data', function (data) {
            //这个this就是socket
            // const request = mk_request(data);
            // const mc = create_memcache_conn(request.key);
            // mc.write(request);
            // mc.on('data', function (data) {
            //     socket.write(data);
            // });
            console.log("index: "+i + " " + "\r\n"+data.toString())
            i++
            // console.log(i)
        });
    }
).listen(config);