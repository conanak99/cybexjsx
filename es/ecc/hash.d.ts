/// <reference types="node" />
/**
 *   @arg {string|Buffer} data
 *   @arg {string} [digest = null] - 'hex', 'binary' or 'base64'
 *   @return {string|Buffer} - Buffer when digest is null, or string
 */
declare function sha1(data: string | Buffer, encoding?: any): Buffer;
/**
 * @arg {string|Buffer} data
 *  @arg {string} [digest = null] - 'hex', 'binary' or 'base64'
 *  @return {string|Buffer} - Buffer when digest is null, or string
 */
declare function sha256(data: string | Buffer, encoding?: any): Buffer;
/**
 *   @arg {string|Buffer} data
 *   @arg {string} [digest = null] - 'hex', 'binary' or 'base64'
 *   @return {string|Buffer} - Buffer when digest is null, or string
 */
declare function sha512(data: string | Buffer, encoding?: any): Buffer;
declare function HmacSHA256(buffer: any, secret: any): Buffer;
declare function ripemd160(data: any): Buffer;
export { sha1, sha256, sha512, HmacSHA256, ripemd160 };
