function get(state) {
    if (state === void 0) { state = {}; }
    return function (key) {
        return state[key] || "";
    };
}
function set(state) {
    if (state === void 0) { state = {}; }
    return function (key, value) {
        state[key] = value;
        return this;
    };
}
export { get, set };
