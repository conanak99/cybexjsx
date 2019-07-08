import { ChainWebSocket, TransactionBuilder } from "./../src";
import { AccountParams } from "./test-user";
import { PrivateKey } from "../src/ecc";
describe("TransactionBuilder Test", () => {
  let ws: ChainWebSocket;
  beforeAll(async function(done) {
    ws = await ChainWebSocket.getInstanceWithWs("wss://shenzhen.51nebula.com");
    done();
  });

  it("Basic Transfer", async done => {
    let tr = new TransactionBuilder(ws, { debug: true });
    let transfer = {
      from: AccountParams.ACCOUNT_ID,
      to: AccountParams.ACCOUNT_ID_1,
      amount: {
        asset_id: "1.3.0",
        amount: 1e5
      },
      fee: {
        asset_id: "1.3.0",
        amount: 0
      }
    };
    tr.add_type_operation("transfer", transfer);
    await tr.set_required_fees();
    tr.add_signer(
      PrivateKey.fromSeed(
        `${AccountParams.ACCOUNT_NAME}active${AccountParams.ACCOUNT_SEED}`
      )
    );
    await expect(tr.broadcast()).resolves.toHaveLength(1);
    done();
  }, 10000);
  it("Proposal Transfer", async done => {
    let tr = new TransactionBuilder(ws, { debug: true });
    let transfer = {
      from: AccountParams.ACCOUNT_ID,
      to: AccountParams.ACCOUNT_ID_1,
      amount: {
        asset_id: "1.3.0",
        amount: 1e5
      },
      fee: {
        asset_id: "1.3.0",
        amount: 0
      }
    };
    tr.add_type_operation("transfer", transfer);
    tr.propose({
      fee_paying_account: AccountParams.ACCOUNT_ID
    });
    await tr.set_required_fees();
    tr.add_signer(
      PrivateKey.fromSeed(
        `${AccountParams.ACCOUNT_NAME}active${AccountParams.ACCOUNT_SEED}`
      )
    );
    await expect(tr.broadcast()).resolves.toHaveLength(1);
    done();
  }, 10000);
});
// describe("Proposal Test", () => {

// });
