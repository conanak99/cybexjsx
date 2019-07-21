/** Exception nesting.  */
var ErrorWithCause = /** @class */ (function () {
    function ErrorWithCause(message, cause) {
        this.message = message;
        this.stack = "";
        if (typeof cause !== "undefined" && cause !== null ? cause.message : undefined) {
            this.message = "cause\t" + cause.message + "\t" + this.message;
        }
        // (new Error).stack
        var stack = "";
        if (typeof cause !== "undefined" && cause !== null ? cause.stack : undefined) {
            stack = "caused by\n\t" + cause.stack + "\t" + stack;
        }
        this.stack = this.message + "\n" + stack;
    }
    ErrorWithCause.throw = function (message, cause) {
        var msg = message;
        if (typeof cause !== "undefined" && cause !== null ? cause.message : undefined) {
            msg += "\t cause: " + cause.message + " ";
        }
        if (typeof cause !== "undefined" && cause !== null ? cause.stack : undefined) {
            msg += "\n stack: " + cause.stack + " ";
        }
        throw new Error(msg);
    };
    return ErrorWithCause;
}());
export default ErrorWithCause;
