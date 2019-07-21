import { ChainWebSocket } from "./../src";
describe("Connect 测试", () => {
  let ws: ChainWebSocket;
  const url = "wss://shenzhen.51nebula.com/";
  beforeAll(async function(done) {
    ws = await ChainWebSocket.getInstanceWithWs(url, { debugMode: false });
    done();
  }, 3000);

  it("Test Get ChainID", async done => {
    let chainID = await ws.api("database")("get_chain_id")();
    expect(chainID).toBe(
      "ab1a36b889e21d2803219d379d10d39ff282b0399934946b1d5b799ceeb9fded"
    );
    done();
  }, 5000);

  it("Test reject after connect disconntion", async done => {
    let chainIDPromise = ws.api("database")("get_chain_id")();
    setTimeout(() => ws.close(), 10);
    await expect(chainIDPromise).rejects.toBe("Connection Closed");
    done();
  }, 5000);
});
