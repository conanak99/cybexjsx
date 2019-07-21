declare type TypePairs = {
    [name: string]: number;
};
declare const ChainTypes: {
    object_type: TypePairs;
    reserved_spaces: TypePairs;
    impl_object_type: TypePairs;
    vote_type: TypePairs;
    operations: TypePairs;
} & object;
export declare function registerChainType(cate: keyof typeof ChainTypes & string, type: string, id: number): {
    [x: string]: number;
};
export declare namespace CybexTypes {
    type DateStr = string;
    type AccountID = string;
    type BlockID = string;
    /** Properties of Object 2.1.0 */
    type GlobalDynamicProperty = {
        accounts_registered_this_interval: number;
        current_aslot: number;
        current_witness: AccountID;
        dynamic_flags: number;
        head_block_id: BlockID;
        head_block_number: number;
        id: "2.1.0";
        last_budget_time: DateStr;
        last_irreversible_block_num: number;
        next_maintenance_time: DateStr;
        recent_slots_filled: string;
        recently_missed_count: number;
        time: DateStr;
        witness_budget: number;
    };
    type BlockHeader = {
        previous: BlockID;
        timestamp: DateStr;
        witness: AccountID;
        transaction_merkle_root: string;
        extensions: any[];
    };
}
export default ChainTypes;
export { ChainTypes };
