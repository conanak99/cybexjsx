/// <reference types="node" />
/** Provides symetric encrypt and decrypt via AES. */
declare class Aes {
    [p: string]: any;
    iv: any;
    key: any;
    /**
     * @arg {string} seed - secret seed may be used to encrypt or decrypt.
     */
    static fromSeed(seed: any): Aes;
    /** @arg {string} hash - A 128 byte hex string, typically one would call {@link fromSeed} instead. */
    static fromSha512(hash: any): Aes;
    static fromBuffer(buf: any): Aes;
    /**
     *   @throws {Error} - "Invalid Key, ..."
     *   @arg {PrivateKey} private_key - required and used for decryption
     *   @arg {PublicKey} public_key - required and used to calcualte the shared secret
     *   @arg {string} [nonce = ""] optional but should always be provided and be unique when re-using the same private/public keys more than once.  This nonce is not a secret.
     *   @arg {string|Buffer} message - Encrypted message containing a checksum
     *   @return {Buffer}
     */
    static decrypt_with_checksum(private_key: any, public_key: any, nonce: any, message: any, legacy?: boolean): Buffer;
    /**
     * Identical to {@link decrypt_with_checksum} but used to encrypt.  Should not throw an error.
     *    @return {Buffer} message - Encrypted message which includes a checksum
     */
    static encrypt_with_checksum(private_key: any, public_key: any, nonce: any, message: any): Buffer;
    /** @private */
    constructor(iv: any, key: any);
    /** This is an excellent way to ensure that all references to Aes can not operate anymore (example: a wallet becomes locked).  An application should ensure there is only one Aes object instance for a given secret `seed`. */
    clear(): any;
    /** @private */
    _decrypt_word_array(cipher: any): any;
    /** @private */
    _encrypt_word_array(plaintext: any): any;
    /**
     * This method does not use a checksum, the returned data must be validated some other way.
     *    @arg {string} ciphertext
     *   @return {Buffer} binary
     */
    decrypt(ciphertext: any): Buffer;
    /**
     * This method does not use a checksum, the returned data must be validated some other way.
     *     @arg {string} plaintext
     *     @return {Buffer} binary
     */
    encrypt(plaintext: any): Buffer;
    /**
     * This method does not use a checksum, the returned data must be validated some other way.
     *    @arg {string|Buffer} plaintext
     *   @return {string} hex
     */
    encryptToHex(plaintext: any): any;
    /**
     * This method does not use a checksum, the returned data must be validated some other way.
     *     @arg {string} cipher - hex
     *     @return {string} binary (could easily be readable text)
     */
    decryptHex(cipher: any): any;
    /**
     * This method does not use a checksum, the returned data must be validated some other way.
     *    @arg {string} cipher - hex
     *    @return {Buffer} encoded as specified by the parameter
     */
    decryptHexToBuffer(cipher: any): Buffer;
    /**
     * This method does not use a checksum, the returned data must be validated some other way.
     *     @arg {string} cipher - hex
     *     @arg {string} [encoding = 'binary'] - a valid Buffer encoding
     *     @return {String} encoded as specified by the parameter
     */
    decryptHexToText(cipher: any, encoding?: string): string;
    /**
     * This method does not use a checksum, the returned data must be validated some other way.
     *     @arg {string} plainhex - hex format
     *    @return {String} hex
     */
    encryptHex(plainhex: any): any;
}
export default Aes;
