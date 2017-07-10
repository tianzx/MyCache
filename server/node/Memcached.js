/**
 * Created by tianzx on 2017/7/10.
 */
/**
 * Created by tianzx on 2017/7/7.
 */
/**
 * node --nouse-idle-notification --expose-gc --max-old-space-size=8192 Memcached.js
 */
var net = require('net');
var store = {}

function handle_header(header, crlf_len) {
    var tup = header.split(" ")
    var expect_body_len = 0
    switch (tup[0]) {
        case 'get':
        case 'delete':
            expect_body_len = 0
            break
        case 'set':
            expect_body_len = parseInt(tup[4]) + crlf_len
            break
        case 'gc':
            expect_body_len = 0
            gc()
            break;
    }
    return expect_body_len
}

function handle_body(socket, header, body, call_back) {
    var response = ""
    var tup = header.split(" ")
    switch (tup[0]) {
        case 'get':
            var key = tup[1]
            var obj = store[key]
            if (obj) {
                response = "VALUE " + obj.key + " " + obj.flag + " " + obj.data.length + "\r\n"
                response += obj.data + "\r\n"
                response += "END\r\n"
            }
            else
                response = "NOT_FOUND\r\n"
            break;
        case 'delete':
            var key = tup[1]
            delete store[key]
            response = "DELETED\r\n"
            break;
        case 'set':
            var obj = {key: tup[1], flag: tup[2], data: body}
            store[obj.key] = obj
            response = "STORED\r\n"
            break;
        case 'gc':
            response = "OK\r\n"
            break;
        default:
            response = "ERROR\r\n"
            break;
    }
    socket.write(response, "binary", call_back)
}

var server = net.createServer(function (socket) {
    console.log("client: ", socket.remoteAddress)
    var user_state = 'reading_header'
    var buf = ""
    var header = ""
    var body = ""
    var expect_body_len = 0
    var CRLF_LEN = 2
    socket.setEncoding("binary")
    socket.on('data', function (data) {
        buf += data
        socket.emit('user_event')
    })
    socket.on('user_event', function () {
        switch (user_state) {
            case "reading_header":
                var pos = -1
                if ((pos = buf.indexOf('\r\n')) != -1) {
                    header = buf.slice(0, pos)
                    buf = buf.slice(pos + 2)
                    CRLF_LEN = 2
                }
                else if ((pos = buf.indexOf('\n')) != -1) {
                    header = buf.slice(0, pos)
                    buf = buf.slice(pos + 1)
                    CRLF_LEN = 1
                }
                if (pos != -1) {
                    user_state = 'reading_body'
                    expect_body_len = handle_header(header, CRLF_LEN)
                    socket.emit("user_event")
                }
                break
            case "reading_body":
                if (expect_body_len <= buf.length) {
                    body = buf.slice(0, expect_body_len - CRLF_LEN)
                    buf = buf.slice(expect_body_len)
                    user_state = 'reading_header'
                    handle_body(socket, header, body,
                        function () {
                            if (buf.length > 0)
                                socket.emit("user_event")
                        }
                    )

                }
                break
        }
    })
});
const port = 11211
console.log("listening at " + port)
server.listen(port, '0.0.0.0')
setInterval(function () {
    gc();
    console.log(process.memoryUsage())
}, 5000)
