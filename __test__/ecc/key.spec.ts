import { PublicKey, PrivateKey, Address, Signature } from "./../../src/ecc";

describe("PublicKey 测试", () => {
  const pubKeyStr = "CYB5bxCtbzMhTVxeep7iR5eKFq1MzgWFeyk8rExgdEXiowfAKSBhX";
  it("Test PublicKey", async done => {
    let pubKey = PublicKey.fromPublicKeyString(pubKeyStr);
    expect(JSON.stringify(Array.from(pubKey.toBuffer()))).toBe(
      "[2,94,37,144,229,233,36,178,19,25,128,98,35,239,97,114,153,81,226,130,151,249,199,71,120,182,146,74,185,192,215,237,1]"
    );
    expect(pubKey.toString()).toBe(
      "CYB5bxCtbzMhTVxeep7iR5eKFq1MzgWFeyk8rExgdEXiowfAKSBhX"
    );
    expect(pubKey.toAddressString()).toBe(
      "CYBEfpvUbsBrndhRnheRqeByzbzai24P1gUU"
    );
    expect(pubKey.toPtsAddy()).toBe("PkE98UPtxp5PNtynWDRQWYiqbwQ7y5mAB5");
    done();
  }, 5000);
});

describe("Private 测试", () => {
  const seed = "abcdefghigklmn1234567890";
  it("Test PrivateKey", done => {
    let privKey = PrivateKey.fromSeed(seed);
    expect(privKey.toWif()).toBe(
      "5JUSgC3DzCXqdNt9v1D5P1UsVjTvbtEbjSecssMD1aQ7uvPnQiM"
    );
    expect(privKey.toPublicKey().toString()).toBe(
      "CYB5BYNw7u3hiisVFd8pGo7KqL5ZPNt6AKMrjhTA7KffixYSCmF7U"
    );
    done();
  });
});

describe("Address 测试", () => {
  it("Test Address", done => {
    const seed = "abcdefghigklmn1234567890";
    let pubKey = PrivateKey.fromSeed(seed).toPublicKey();
    let address = Address.fromPublic(pubKey);
    expect(address.toString()).toBe("CYB9s24PgDcQdXDWx7uNdZd2qineBLns5pd8");
    done();
  });
});

describe("Signature", () => {
  it("Test Address", done => {
    const seed = "abcdefghigklmn1234567890";
    let privKey = PrivateKey.fromSeed(seed);
    let sign = Signature.signBuffer(Buffer.from(seed), privKey);
    expect(sign.toHex()).toBe(
      "2014f27ed73017721d5b862ba32e04f11f704da4bbb3251c1a9f59595598f9c5113f1583d41b62698e9aa24871422098ecbeba5b3025099321f932c5cc53c915b4"
    );
    done();
  });
});
