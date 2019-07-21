import Long from "long";
declare class ObjectId {
    space: any;
    type: any;
    instance: any;
    [p: string]: any;
    constructor(space: any, type: any, instance: any);
    static fromString(value: any): any;
    static fromLong(long: any): ObjectId;
    static fromByteBuffer(b: any): ObjectId;
    toLong(): Long;
    appendByteBuffer(b: any): any;
    toString(): string;
}
export default ObjectId;
