/** Exception nesting.  */
declare class ErrorWithCause {
    message: any;
    [param: string]: any;
    stack: string;
    constructor(message: any, cause: any);
    static throw(message: any, cause: any): void;
}
export default ErrorWithCause;
