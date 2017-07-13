/**
 * Created by tianzx on 2017/7/13.
 */
/**
 * Request header parse
 * @param headerBuf
 * @returns {*}
 */
/**
 0              |       1       |       2       |       3       |
 /              |               |               |               |
 |0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|
 +---------------+---------------+---------------+---------------+
 0| Magic         | Opcode        | Key length                    |
 +---------------+---------------+---------------+---------------+
 4| Extras length | Data type     | vbucket id                    |
 +---------------+---------------+---------------+---------------+
 8| Total body length                                             |
 +---------------+---------------+---------------+---------------+
 12| Opaque                                                        |
 +---------------+---------------+---------------+---------------+
 16| CAS                                                           |
 |                                                               |
 +---------------+---------------+---------------+---------------+
 Total 24 bytes
 * @param headerBuf
 * @returns {*}
 * network transfer use big
 * headerBuf buffer
 */

/**
 Byte/     0       |       1       |       2       |       3       |
 /              |               |               |               |
 |0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|
 +---------------+---------------+---------------+---------------+
 0| 0x80          | 0x00          | 0x00          | 0x05          |
 +---------------+---------------+---------------+---------------+
 4| 0x00          | 0x00          | 0x00          | 0x00          |
 +---------------+---------------+---------------+---------------+
 8| 0x00          | 0x00          | 0x00          | 0x05          |
 +---------------+---------------+---------------+---------------+
 12| 0x00          | 0x00          | 0x00          | 0x00          |
 +---------------+---------------+---------------+---------------+
 16| 0x00          | 0x00          | 0x00          | 0x00          |
 +---------------+---------------+---------------+---------------+
 20| 0x00          | 0x00          | 0x00          | 0x00          |
 +---------------+---------------+---------------+---------------+
 24| 0x48 ('H')    | 0x65 ('e')    | 0x6c ('l')    | 0x6c ('l')    |
 +---------------+---------------+---------------+---------------+
 28| 0x6f ('o')    |
 +---------------+

 Total 29 bytes (24 byte header, and 5 bytes key)

 Field        (offset) (value)
 Magic        (0)    : 0x80
 Opcode       (1)    : 0x00
 Key length   (2,3)  : 0x0005
 Extra length (4)    : 0x00
 Data type    (5)    : 0x00
 VBucket      (6,7)  : 0x0000
 Total body   (8-11) : 0x00000005
 Opaque       (12-15): 0x00000000
 CAS          (16-23): 0x0000000000000000
 Extras              : None
 Key          (24-29): The textual string: "Hello"
 Value               : None
 * @param headerBuf
 * @returns {*}
 */
const fromBuffer = function (headerBuf) {

    if (!headerBuf) {
        console.log('Cannot not parse empty buffer!');
        return {};
    }
    return {
        magic: headerBuf.readUInt8(0),
        opcode: headerBuf.readUInt8(1),
        keyLength: headerBuf.readUInt16BE(2),
        extrasLength: headerBuf.readUInt8(4),
        dataType: headerBuf.readUInt8(5),
        status: headerBuf.readUInt16BE(6),
        totalBodyLength: headerBuf.readUInt32BE(8),
        opaque: headerBuf.readUInt32BE(12),
        cas: headerBuf.slice(16, 24)
    };
}
/**
 *  Response header parse
 * @param header
 * @returns {Buffer}
 * header obj
 */
const toBuffer = function (header) {
    headerBuf = new Buffer(24);
    headerBuf.fill();
    headerBuf.writeUInt8(header.magic, 0);
    headerBuf.writeUInt8(header.opcode, 1);
    headerBuf.writeUInt16BE(header.keyLength, 2);
    headerBuf.writeUInt8(header.extrasLength, 4);
    headerBuf.writeUInt8(header.dataType || 0, 5);
    headerBuf.writeUInt16BE(header.status || 0, 6);
    headerBuf.writeUInt32BE(header.totalBodyLength, 8);
    headerBuf.writeUInt32BE(header.opaque || 0, 12);
    if (header.cas) {
        header.cas.copy(headerBuf, 16);
    }
    return headerBuf;
}

exports.fromBuffer = fromBuffer;
exports.toBuffer = toBuffer;