"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function normalize(brainKey) {
    if (typeof brainKey !== "string") {
        throw new Error("string required for brainKey");
    }
    brainKey = brainKey.trim();
    return brainKey.split(/[\t\n\v\f\r ]+/).join(" ");
}
exports.default = normalize;
