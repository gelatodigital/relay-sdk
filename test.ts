import { utils, Wallet } from "ethers";

import { GelatoRelaySDK } from "./src";

const CHAIN_ID = 42;
const NATIVE_TOKEN = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
const HELLO_WORLD = "0x61bBe925A5D646cE074369A6335e5095Ea7abB7A";

const callRequest = async () => {
  // abi encode for HelloWorld.sayHiVanilla(address _feeToken) (see 0x61bBe925A5D646cE074369A6335e5095Ea7abB7A on Kovan)
  const data = `0x4b327067000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`;

  await GelatoRelaySDK.sendCallRequest(
    CHAIN_ID,
    HELLO_WORLD,
    data,
    NATIVE_TOKEN
  );
};

const forwardRequest = async () => {
  const wallet = Wallet.createRandom();
  const sponsor = await wallet.getAddress();

  console.log(`Mock PK: ${await wallet._signingKey().privateKey}`);
  console.log(`Mock wallet address: ${sponsor}`);
  // abi encode for HelloWorld.sayHiVanilla(address _feeToken) (see 0x61bBe925A5D646cE074369A6335e5095Ea7abB7A on Kovan)
  const data = `0x4b327067000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeaeeeeeeeeeeeeeeeee`;

  const forwardRequest = GelatoRelaySDK.forwardRequest(
    CHAIN_ID,
    HELLO_WORLD,
    data,
    NATIVE_TOKEN,
    1,
    "1000000000000000000",
    0,
    false,
    sponsor
  );

  const digest = GelatoRelaySDK.getForwardRequestDigestToSign(forwardRequest);

  const sponsorSignature: utils.BytesLike = utils.joinSignature(
    await wallet._signingKey().signDigest(digest)
  );

  await GelatoRelaySDK.sendForwardRequest(forwardRequest, sponsorSignature);
};

const metaTxRequest = async () => {
  const wallet = Wallet.createRandom();
  const user = await wallet.getAddress();

  console.log(`Mock wallet address: ${user}`);
  // abi encode for HelloWorld.sayHi(address _feeToken) (see 0x61bBe925A5D646cE074369A6335e5095Ea7abB7A on Kovan)
  const data = `0x4c6d2627000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`;

  const metaTxRequest = GelatoRelaySDK.metaTxRequest(
    CHAIN_ID,
    HELLO_WORLD,
    data,
    NATIVE_TOKEN,
    1,
    "100000000000000000000",
    user,
    0
  );

  const digest = GelatoRelaySDK.getMetaTxRequestDigestToSign(metaTxRequest);

  const userSignature: utils.BytesLike = utils.joinSignature(
    await wallet._signingKey().signDigest(digest)
  );

  await GelatoRelaySDK.sendMetaTxRequest(metaTxRequest, userSignature);
};

async function main() {
  await callRequest();
  await forwardRequest();
  await metaTxRequest();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
