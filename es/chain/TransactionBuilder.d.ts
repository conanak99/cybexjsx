/// <reference types="node" />
import { PublicKey, PrivateKey } from "../ecc";
import { Serializer } from "../serializer";
import { OperationManager } from "./Operation";
import { CybexTypes } from "./ChainTypes";
import { ChainWebSocket } from "./../connect/cybex-ws";
import { SignedTransaction } from "../serializer/operations";
declare class DefaultTrParams implements SignedTransaction {
    ref_block_num: number;
    ref_block_prefix: number;
    expiration: number;
    operations: any[];
    signatures: any[];
    extensions: any[];
}
declare const DefaultOptions: {
    tx: DefaultTrParams;
    skipUpdate: boolean;
    txExpiration: number;
    expire_in_secs_proposal: number;
    review_in_secs_committee: number;
    debug: boolean;
};
declare type TBOptions = typeof DefaultOptions;
export declare class TransactionBuilder {
    wsConnect: ChainWebSocket;
    signer_private_keys: [PrivateKey, PublicKey][];
    opManager: OperationManager;
    tr_buffer: Buffer;
    tx: DefaultTrParams;
    signed: boolean;
    options: TBOptions;
    chain_id: string;
    constructor(wsConnect: ChainWebSocket, options?: Partial<TBOptions>);
    /**
          @arg {string} name - like "transfer"
          @arg {object} operation - JSON matchching the operation's format
      */
    add_type_operation(name: string, operation: any): void;
    /** Typically this is called automatically just prior to signing.  Once finalized this transaction can not be changed. */
    finalize(refBlockHeader?: CybexTypes.BlockHeader): Promise<void>;
    /** @return {string} hex transaction ID */
    id(): string;
    /**
          Typically one will use {@link this.add_type_operation} instead.
          @arg {array} operation - [operation_id, operation]
      */
    add_operation(operation: [number, any]): void;
    get_type_operation(name: string, operation: {
        fee: {
            amount: number;
            asset_id: number;
        };
        proposed_ops: {
            forEach: (arg0: (op: any) => void) => void;
        };
        expiration_time: number;
        review_period_seconds: number;
    }): [number, Serializer<any>];
    update_head_block(): Promise<void>;
    debugLog(...params: any[]): void;
    /** optional: there is a deafult expiration */
    set_expire_seconds(sec: number): number;
    propose(proposal_create_options: {
        fee_paying_account: CybexTypes.AccountID;
        proposed_ops?: any;
    }): this;
    has_proposed_operation(): boolean;
    /** optional: the fees can be obtained from the witness node */
    set_required_fees(asset_id?: string): Promise<void>;
    get_potential_signatures(): Promise<{
        pubkeys: any;
        addys: any;
    }>;
    get_required_signatures(available_keys: {
        length: any;
    }): Promise<any>;
    add_signer(private_key: PrivateKey, public_key?: PublicKey): void;
    sign(chain_id?: string): void;
    serialize(): {};
    toObject(): {};
    _broadcast<R = any>(was_broadcast_callback: CallableFunction): Promise<R>;
    broadcast<R = any>(was_broadcast_callback?: CallableFunction): Promise<R>;
}
export default TransactionBuilder;
