/// <reference types="node" />
import ObjectId from "../chain/ObjectId";
import { PublicKey, Address } from "../ecc";
export declare const Types: {
    address: {
        _to_address(object: any): any;
        fromByteBuffer(b: any): Address;
        appendByteBuffer(b: any, object: any): void;
        fromObject(object: any): any;
        toObject(object: any, debug?: any): any;
        compare(a: any, b: any): 1 | 0 | -1;
    };
    public_key: {
        toPublic(object: any): any;
        fromByteBuffer(b: any): PublicKey;
        appendByteBuffer(b: any, object: any): void;
        fromObject(object: any): any;
        toObject(object: any, debug?: any): any;
        compare(a: any, b: any): 1 | 0 | -1;
    };
    map: (key_st_operation: any, value_st_operation: any) => {
        validate(array: any): any;
        fromByteBuffer(b: any): any;
        appendByteBuffer(b: any, object: any): void;
        fromObject(object: any): any;
        toObject(object: any, debug?: any): any[];
    };
    static_variant: (_st_operations?: any) => {
        nosort: boolean;
        st_operations: any;
        fromByteBuffer(b: any): any[];
        appendByteBuffer(b: any, object: any): void;
        fromObject(object: any): any[];
        toObject(object: any, debug?: any): any[];
    };
    optional: (st_operation?: any) => {
        fromByteBuffer(b: any): any;
        appendByteBuffer(b: any, object: any): void;
        fromObject(object: any): any;
        toObject(object: any, debug?: any): any;
    };
    vote_id: {
        TYPE: number;
        ID: number;
        fromByteBuffer(b: any): {
            type: number;
            id: number;
        };
        appendByteBuffer(b: any, object: any): void;
        fromObject(object: any): any;
        toObject(object: any, debug?: any): string;
        compare(a: any, b: any): number;
    };
    void: {
        fromByteBuffer(b: any): never;
        appendByteBuffer(b: any, object: any): never;
        fromObject(object: any): never;
        toObject(object: any, debug?: any): any;
    };
    object_id_type: {
        fromByteBuffer(b: any): ObjectId;
        appendByteBuffer(b: any, object: any): void;
        fromObject(object: any): any;
        toObject(object: any, debug?: any): any;
    };
    protocol_id_type: (name: string) => {
        fromByteBuffer(b: any): any;
        appendByteBuffer(b: any, object: any): void;
        fromObject(object: any): any;
        toObject(object: any, debug?: any): string;
    };
    id_type: (reserved_spaces: any, object_type: any) => {
        fromByteBuffer(b: any): any;
        appendByteBuffer(b: any, object: any): void;
        fromObject(object: any): any;
        toObject(object: any, debug?: any): string;
    };
    fixed_array: (count: any, st_operation: any) => {
        fromByteBuffer(b: any): any;
        appendByteBuffer(b: any, object: any): void;
        fromObject(object: any): any;
        toObject(object: any, debug: any): any;
    };
    array: (st_operation: any) => {
        fromByteBuffer(b: any): any;
        appendByteBuffer(b: any, object: any): void;
        fromObject(object: any): any[];
        toObject(object: any, debug?: any): any[];
    };
    vector: (st_operation: any) => {
        fromByteBuffer(b: any): any;
        appendByteBuffer(b: any, object: any): void;
        fromObject(object: any): any[];
        toObject(object: any, debug?: any): any[];
    };
    bool: {
        fromByteBuffer(b: any): boolean;
        appendByteBuffer(b: any, object: any): void;
        fromObject(object: any): boolean;
        toObject(object: any, debug?: any): boolean;
    };
    bytes: (size?: number) => {
        fromByteBuffer(b: any): Buffer;
        appendByteBuffer(b: any, object: any): void;
        fromObject(object: any): Buffer;
        toObject(object: any, debug?: any): any;
    };
    int64: {
        fromByteBuffer(b: any): any;
        appendByteBuffer(b: any, object: any): void;
        fromObject(object: any): any;
        toObject(object: any, debug?: any): any;
    };
    share_type: {
        fromByteBuffer(b: any): any;
        appendByteBuffer(b: any, object: any): void;
        fromObject(object: any): any;
        toObject(object: any, debug?: any): any;
    };
    set: (st_operation: any) => {
        validate(array: any): any;
        fromByteBuffer(b: any): any;
        appendByteBuffer(b: any, object: any): void;
        fromObject(object: any): any;
        toObject(object: any, debug?: any): any;
    };
    string: {
        fromByteBuffer(b: any): Buffer;
        appendByteBuffer(b: any, object: any): void;
        fromObject(object: any): Buffer;
        toObject(object: any, debug?: any): any;
    };
    time_point_sec: {
        fromByteBuffer(b: any): any;
        appendByteBuffer(b: any, object: any): void;
        fromObject(object: any): number;
        toObject(object: any, debug?: any): any;
    };
    uint8: {
        fromByteBuffer(b: any): any;
        appendByteBuffer(b: any, object: any): void;
        fromObject(object: any): any;
        toObject(object: any, debug?: any): number;
    };
    uint16: {
        fromByteBuffer(b: any): any;
        appendByteBuffer(b: any, object: any): void;
        fromObject(object: any): any;
        toObject(object: any, debug?: any): number;
    };
    uint32: {
        fromByteBuffer(b: any): any;
        appendByteBuffer(b: any, object: any): void;
        fromObject(object: any): any;
        toObject(object: any, debug?: any): number;
    };
    uint64: {
        fromByteBuffer(b: any): any;
        appendByteBuffer(b: any, object: any): void;
        fromObject(object: any): any;
        toObject(object: any, debug?: any): any;
    };
    varint32: {
        fromByteBuffer(b: any): any;
        appendByteBuffer(b: any, object: any): void;
        fromObject(object: any): any;
        toObject(object: any, debug?: any): number;
    };
};
export default Types;
