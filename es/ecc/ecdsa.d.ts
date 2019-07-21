import BigInteger from "bigi";
declare function deterministicGenerateK(curve: any, hash: any, d: any, checkSig: any, nonce: any): BigInteger;
declare function sign(curve: any, hash: any, d: any, nonce: any): any;
declare function verifyRaw(curve: any, e: any, signature: any, Q: any): any;
declare function verify(curve: any, hash: any, signature: any, Q: any): any;
/**
 * Recover a public key from a signature.
 *
 * See SEC 1: Elliptic Curve Cryptography, section 4.1.6, "Public
 * Key Recovery Operation".
 *
 * http://www.secg.org/download/aid-780/sec1-v2.pdf
 */
declare function recoverPubKey(curve: any, e: any, signature: any, i: any): any;
/**
 * Calculate pubkey extraction parameter.
 *
 * When extracting a pubkey from a signature, we have to
 * distinguish four different cases. Rather than putting this
 * burden on the verifier, Bitcoin includes a 2-bit value with the
 * signature.
 *
 * This function simply tries all four cases and returns the value
 * that resulted in a successful pubkey recovery.
 */
declare function calcPubKeyRecoveryParam(curve: any, e: any, signature: any, Q: any): number;
export { calcPubKeyRecoveryParam, deterministicGenerateK, recoverPubKey, sign, verify, verifyRaw };
