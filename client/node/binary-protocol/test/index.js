/**
 * Created by tianzx on 2017/7/13.
 */
/**
 *  <Buffer 56 41 4c 55 45 20 6e 61 6d 65 20 31 20 36 0d 0a 74 69 61 6e 7a 78 0d 0a 45 4e 44 0d 0a>
 *
 VALUE name 1 6
 tianzx
 END
 VALUE name 1 6\r\n tianzx\r\n END\r\n
 * @type {Buffer}
 */
const buffer = new Buffer("VALUE name 1 6\r\n tianzx\r\n END\r\n")

const buffer2 = new Buffer(2)
const buffer3 = new Buffer(2)
// console.log(buffer.readUInt8(0))
// console.log(new Uint8Array(buffer)[0])
//0x5641
// console.log(buffer.readUInt16BE(0))
//0x4156
// console.log(buffer.readUInt16LE(0))

// console.log(buffer.slice(0,2))
// headerBuf.writeUInt16BE(header.status || 0, 6);
const data = console.log(buffer.readUInt16BE(0))
// const data2 = buffer2.writeUInt16BE("VAFASDFAFA")
buffer2.writeUInt16BE(0x5641||0, 0);
console.log(buffer2)
