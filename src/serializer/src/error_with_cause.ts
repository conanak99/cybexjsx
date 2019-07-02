/** Exception nesting.  */
class ErrorWithCause {
  [param: string]: any;
  constructor(message, cause) {
    this.message = message;
    if (
      typeof cause !== "undefined" && cause !== null ? cause.message : undefined
    ) {
      this.message = `cause\t${cause.message}\t` + this.message;
    }

    // (new Error).stack
    var stack = "";
    if (
      typeof cause !== "undefined" && cause !== null ? cause.stack : undefined
    ) {
      stack = `caused by\n\t${cause.stack}\t` + stack;
    }

    this.stack = this.message + "\n" + stack;
  }

  static throw(message, cause) {
    var msg = message;
    if (
      typeof cause !== "undefined" && cause !== null ? cause.message : undefined
    ) {
      msg += `\t cause: ${cause.message} `;
    }
    if (
      typeof cause !== "undefined" && cause !== null ? cause.stack : undefined
    ) {
      msg += `\n stack: ${cause.stack} `;
    }
    throw new Error(msg);
  }
}

export default ErrorWithCause;
