"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertResultUniversal = (result) => __awaiter(this, void 0, void 0, function* () {
    return "error" in result
        ? Promise.reject({ result: result.error, id: result.id })
        : "result" in result
            ? Promise.resolve({ result: result.result, id: result.id, isSub: false })
            : Promise.resolve({
                result: result.params[1],
                id: result.params[0],
                isSub: true
            });
});
