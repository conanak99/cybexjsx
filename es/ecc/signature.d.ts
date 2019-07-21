import PublicKey from "./PublicKey";
declare class Signature {
    r: any;
    s: any;
    i: any;
    appendByteBuffer: any;
    constructor(r1: any, s1: any, i1: any);
    static fromBuffer(buf: any): Signature;
    /**
          @param {Buffer} buf
          @param {PrivateKey} private_key
          @return {Signature}
      */
    static signBuffer(buf: any, private_key: any): Signature;
    /** Sign a buffer of exactally 32 bytes in size (sha256(text))
          @param {Buffer} buf - 32 bytes binary
          @param {PrivateKey} private_key
          @return {Signature}
      */
    static signBufferSha256(buf_sha256: any, private_key: any): Signature;
    static sign(string: any, private_key: any): Signature;
    static fromHex(hex: any): Signature;
    static signHex(hex: any, private_key: any): Signature;
    toBuffer(): any;
    recoverPublicKeyFromBuffer(buffer: any): PublicKey;
    /**
          @return {PublicKey}
      */
    recoverPublicKey(sha256_buffer: any): PublicKey;
    /**
          @param {Buffer} un-hashed
          @param {./PublicKey}
          @return {boolean}
      */
    verifyBuffer(buf: any, public_key: any): any;
    verifyHash(hash: any, public_key: any): any;
    toByteBuffer(): any;
    toHex(): any;
    verifyHex(hex: any, public_key: any): any;
}
export default Signature;
