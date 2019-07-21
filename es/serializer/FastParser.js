import PublicKey from "../ecc/PublicKey";
var FastParser = /** @class */ (function () {
    function FastParser() {
    }
    FastParser.fixed_data = function (b, len, buffer) {
        if (!b) {
            return;
        }
        if (buffer) {
            var data = buffer.slice(0, len).toString("binary");
            b.append(data, "binary");
            while (len-- > data.length) {
                b.writeUint8(0);
            }
        }
        else {
            var b_copy = b.copy(b.offset, b.offset + len);
            b.skip(len);
            return Buffer.from(b_copy.toBinary(), "binary");
        }
    };
    FastParser.public_key = function (b, public_key) {
        if (!b) {
            return;
        }
        if (public_key) {
            var buffer = public_key.toBuffer();
            b.append(buffer.toString("binary"), "binary");
            return;
        }
        else {
            buffer = FastParser.fixed_data(b, 33);
            return PublicKey.fromBuffer(buffer);
        }
    };
    FastParser.ripemd160 = function (b, ripemd160) {
        if (!b) {
            return;
        }
        if (ripemd160) {
            FastParser.fixed_data(b, 20, ripemd160);
            return;
        }
        else {
            return FastParser.fixed_data(b, 20);
        }
    };
    FastParser.time_point_sec = function (b, epoch) {
        if (epoch) {
            epoch = Math.ceil(epoch / 1000);
            b.writeInt32(epoch);
            return;
        }
        else {
            epoch = b.readInt32(); // fc::time_point_sec
            return new Date(epoch * 1000);
        }
    };
    return FastParser;
}());
export default FastParser;
