"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ops = __importStar(require("../serializer/operations"));
const ChainTypes_1 = require("./ChainTypes");
class Operation {
    constructor(name, opID, serializer) {
        this.name = name;
        this.opID = opID;
        this.serializer = serializer;
    }
}
exports.Operation = Operation;
const DefaultOps = Object.entries(ChainTypes_1.ChainTypes.operations).map(op => new Operation(op[0], op[1], ops[op[0]]));
class OperationManager {
    constructor(ops = DefaultOps || []) {
        this.ops = ops;
    }
    static getOpManager() {
        return opManager;
    }
    addOpConfig(op) {
        this.ops.push(op);
        ops.operation.st_operations[op.opID] = op.serializer;
    }
    getOperationByName(name) {
        return this.ops.find(op => op.name === name);
    }
    getOperationByOpID(id) {
        return this.ops.find(op => op.opID === id);
    }
}
exports.OperationManager = OperationManager;
const opManager = new OperationManager();
