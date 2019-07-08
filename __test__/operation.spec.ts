import { OperationManager } from "./../src/chain/Operation";

describe("Operation 测试", () => {
  it("默认OperationManager", () => {
    let manager = OperationManager.getOpManager();
    expect(manager.ops.length).toBeGreaterThan(0);
  });
  it("以TransferOp测试Operation", () => {
    let manager = OperationManager.getOpManager();
    const transfer = {
      from: "1.2.28",
      to: "1.2.8",
      amount: {
        asset_id: "1.3.0",
        amount: 100000
      },
      fee: {
        asset_id: "1.3.0",
        amount: 100000
      }
    };
    let str = manager.getOperationByName("transfer").serializer.toHex(transfer);
    expect(manager.ops.length).toBeGreaterThan(0);
    expect(str).toBe("a086010000000000001c08a086010000000000000000");
  });
});
