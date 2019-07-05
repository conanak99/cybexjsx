import { Serializer } from "../../serializer";
import * as ops from "../../serializer/src/operations";
import { ChainTypes } from "./ChainTypes";
export class Operation<T> {
  constructor(
    public name: string,
    public opID: number,
    public serializer: Serializer<T>
  ) {}
}

const DefaultOps = Object.entries(ChainTypes.operations).map(
  op => new Operation(op[0], op[1], ops[op[0]])
);

export class OperationManager {
  static getOpManager() {
    return opManager;
  }
  constructor(public ops: Operation<any>[] = DefaultOps || []) {}
  addOpConfig<T = any>(op: Operation<T>) {
    this.ops.push(op);
  }
  getOperationByName(name: string) {
    return this.ops.find(op => op.name === name);
  }
  getOperationByOpID(id: number) {
    return this.ops.find(op => op.opID === id);
  }
}

const opManager = new OperationManager();
