declare function ECSignature(r: any, s: any): void;
declare namespace ECSignature {
    var parseCompact: (buffer: any) => {
        compressed: boolean;
        i: number;
        signature: any;
    };
    var fromDER: (buffer: any) => any;
    var parseScriptSignature: (buffer: any) => {
        signature: any;
        hashType: any;
    };
}
export default ECSignature;
