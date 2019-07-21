/// <reference types="node" />
export default function (type: any): {
    fromHex(hex: any): any;
    toHex(object: any): string;
    fromBuffer(buffer: any): any;
    toBuffer(object: any): Buffer;
    fromBinary(string: any): any;
    toBinary(object: any): string;
};
