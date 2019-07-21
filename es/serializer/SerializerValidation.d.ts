/**
 *
 *   Most validations are skipped and the value returned unchanged when an empty string, null, or undefined is encountered (except "required").
 *   Validations support a string format for dealing with large numbers.
 */
declare var _my: {
    is_empty(value: any): boolean;
    required(value: any, field_name?: string): any;
    require_long(value: any, field_name?: string): any;
    string(value: any): any;
    number(value: any): any;
    whole_number(value: any, field_name?: string): any;
    unsigned(value: any, field_name?: string): any;
    is_digits(value: any): boolean;
    to_number(value: any, field_name?: string): any;
    to_long(value: any, field_name?: string): any;
    to_string(value: any, field_name?: string): any;
    require_test(regex: any, value: any, field_name?: string): any;
    require_match(regex: any, value: any, field_name?: string): any;
    require_object_id(value: any, field_name: any): any;
    require_range(min: any, max: any, value: any, field_name?: string): any;
    require_object_type(reserved_spaces: number, type: any, value: any, field_name?: string): any;
    get_instance(reserve_spaces: any, type: any, value: any, field_name?: any): any;
    require_relative_type(type: any, value: any, field_name: any): any;
    get_relative_instance(type: any, value: any, field_name: any): any;
    require_protocol_type(type: any, value: any, field_name: any): any;
    get_protocol_instance(type: any, value: any, field_name: any): any;
    get_protocol_type(value: any, field_name: any): any;
    get_protocol_type_name(value: any, field_name: any): any;
    require_implementation_type(type: any, value: any, field_name: any): any;
    get_implementation_instance(type: any, value: any, field_name: any): any;
    no_overflow53(value: any, field_name?: string): void;
    no_overflow64(value: any, field_name?: string): void;
};
export default _my;
