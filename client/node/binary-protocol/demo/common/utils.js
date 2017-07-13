/**
 * Created by tianzx on 2017/7/13.
 */
var header = require('./header');
exports.makeRequestBuffer = function (opcode, key, extras, value) {
    const buf = new Buffer(24 + key.length + extras.length + value.length);
    buf.fill();
    let requestHeader = {
        magic: 0x80,
        opcode: opcode,
        keyLength: key.length,
        extrasLength: extras.length,
        totalBodyLength: key.length + extras.length + value.length
    }
    header.toBuffer(requestHeader).copy(buf);
    buf.write(extras, 24)
    buf.write(key, 24 + extras.length);
    buf.write(value, 24 + extras.length + key.length);
}

exports.hashcode = function (str) {
    for (var ret = 0, i = 0, len = str.length; i < len; i++) {
        ret = (31 * ret + str.charCodeAt(i)) << 0;
    }
    return ret;
}

exports.parseResponse = function (dataBuf) {
    if(dataBuf.length<24) {
        return false
    }

}