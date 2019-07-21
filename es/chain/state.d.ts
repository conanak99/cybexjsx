declare function get(state?: {}): (key: string | number) => any;
declare function set(state?: {}): (key: string | number, value: any) => any;
export { get, set };
