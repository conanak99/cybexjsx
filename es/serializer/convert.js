import ByteBuffer from "bytebuffer";
export default function (type) {
    return {
        fromHex: function (hex) {
            var b = ByteBuffer.fromHex(hex, ByteBuffer.LITTLE_ENDIAN);
            return type.fromByteBuffer(b);
        },
        toHex: function (object) {
            var b = toByteBuffer(type, object);
            return b.toHex();
        },
        fromBuffer: function (buffer) {
            var b = ByteBuffer.fromBinary(buffer.toString(), ByteBuffer.LITTLE_ENDIAN);
            return type.fromByteBuffer(b);
        },
        toBuffer: function (object) {
            return Buffer.from(toByteBuffer(type, object).toBinary(), "binary");
        },
        fromBinary: function (string) {
            var b = ByteBuffer.fromBinary(string, ByteBuffer.LITTLE_ENDIAN);
            return type.fromByteBuffer(b);
        },
        toBinary: function (object) {
            return toByteBuffer(type, object).toBinary();
        }
    };
}
var toByteBuffer = function (type, object) {
    var b = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN);
    type.appendByteBuffer(b, object);
    return b.copy(0, b.offset);
};
