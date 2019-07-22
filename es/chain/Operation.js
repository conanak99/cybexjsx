import * as ops from "../serializer/operations";
import { ChainTypes } from "./ChainTypes";
var Operation = /** @class */ (function () {
    function Operation(name, opID, serializer) {
        this.name = name;
        this.opID = opID;
        this.serializer = serializer;
    }
    return Operation;
}());
export { Operation };
var DefaultOps = Object.entries(ChainTypes.operations).map(function (op) { return new Operation(op[0], op[1], ops[op[0]]); });
var OperationManager = /** @class */ (function () {
    function OperationManager(ops) {
        if (ops === void 0) { ops = DefaultOps || []; }
        this.ops = ops;
    }
    OperationManager.getOpManager = function () {
        return opManager;
    };
    OperationManager.prototype.addOpConfig = function (op) {
        this.ops.push(op);
        ops.operation.st_operations[op.opID] = op.serializer;
    };
    OperationManager.prototype.getOperationByName = function (name) {
        return this.ops.find(function (op) { return op.name === name; });
    };
    OperationManager.prototype.getOperationByOpID = function (id) {
        return this.ops.find(function (op) { return op.opID === id; });
    };
    return OperationManager;
}());
export { OperationManager };
var opManager = new OperationManager();
