"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_hash_1 = __importDefault(require("create-hash"));
const create_hmac_1 = __importDefault(require("create-hmac"));
/**
 *   @arg {string|Buffer} data
 *   @arg {string} [digest = null] - 'hex', 'binary' or 'base64'
 *   @return {string|Buffer} - Buffer when digest is null, or string
 */
function sha1(data, encoding) {
    return create_hash_1.default("sha1")
        .update(data)
        .digest(encoding);
}
exports.sha1 = sha1;
/**
 * @arg {string|Buffer} data
 *  @arg {string} [digest = null] - 'hex', 'binary' or 'base64'
 *  @return {string|Buffer} - Buffer when digest is null, or string
 */
function sha256(data, encoding) {
    return create_hash_1.default("sha256")
        .update(data)
        .digest(encoding);
}
exports.sha256 = sha256;
/**
 *   @arg {string|Buffer} data
 *   @arg {string} [digest = null] - 'hex', 'binary' or 'base64'
 *   @return {string|Buffer} - Buffer when digest is null, or string
 */
function sha512(data, encoding) {
    return create_hash_1.default("sha512")
        .update(data)
        .digest(encoding);
}
exports.sha512 = sha512;
function HmacSHA256(buffer, secret) {
    return create_hmac_1.default("sha256", secret)
        .update(buffer)
        .digest();
}
exports.HmacSHA256 = HmacSHA256;
function ripemd160(data) {
    return create_hash_1.default("rmd160")
        .update(data)
        .digest();
}
exports.ripemd160 = ripemd160;
