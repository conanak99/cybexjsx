import { Serializer } from "../serializer";
export declare class Operation<T> {
    name: string;
    opID: number;
    serializer: Serializer<T>;
    constructor(name: string, opID: number, serializer: Serializer<T>);
}
export declare class OperationManager {
    ops: Operation<any>[];
    static getOpManager(): OperationManager;
    constructor(ops?: Operation<any>[]);
    addOpConfig<T = any>(op: Operation<T>): void;
    getOperationByName(name: string): Operation<any>;
    getOperationByOpID(id: number): Operation<any>;
}
