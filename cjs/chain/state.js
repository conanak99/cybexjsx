"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function get(state = {}) {
    return function (key) {
        return state[key] || "";
    };
}
exports.get = get;
function set(state = {}) {
    return function (key, value) {
        state[key] = value;
        return this;
    };
}
exports.set = set;
