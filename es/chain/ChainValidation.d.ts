declare var chainValidation: {
    is_account_name: (value: any, allow_too_short?: boolean) => boolean;
    is_object_id: (obj_id: any) => boolean;
    is_empty: (value: any) => boolean;
    is_account_name_error: (value: any, allow_too_short: any) => string;
    is_cheap_name: (account_name: any) => boolean;
    is_empty_user_input: (value: any) => boolean;
    required: (value: any, field_name?: string) => any;
    /** @see is_valid_symbol graphene/libraries/chain/protocol/asset_ops.cpp */
    is_valid_symbol_error: (value: any) => string;
};
export { chainValidation };
export default chainValidation;
