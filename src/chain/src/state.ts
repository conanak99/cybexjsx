function get(state = {}) {
  return function(key: string | number) {
    return state[key] || "";
  };
}

function set(state = {}) {
  return function(key: string | number, value: any) {
    state[key] = value;
    return this;
  };
}

export { get, set };
