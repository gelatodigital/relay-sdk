import { utils, Wallet } from "ethers";

import { GelatoRelaySDK } from "./src";

const NATIVE_TOKEN = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
const GAS = "200000";

const callRequest = async (chainId: number, target: string) => {
  // abi encode for HelloWorld.sayHiVanilla(address _feeToken) (see 0x61bBe925A5D646cE074369A6335e5095Ea7abB7A on Kovan)
  const data = `0x4b327067000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`;

  const taskId = await GelatoRelaySDK.sendCallRequest(
    chainId,
    target,
    data,
    NATIVE_TOKEN,
    GAS
  );

  const status = await GelatoRelaySDK.getStatus(taskId);

  console.log(`Status for task ${taskId}: ${JSON.stringify(status)}`);
};

const forwardRequest = async (chainId: number, target: string) => {
  const wallet = Wallet.createRandom();
  const sponsor = await wallet.getAddress();

  console.log(`Mock PK: ${await wallet._signingKey().privateKey}`);
  console.log(`Mock wallet address: ${sponsor}`);
  // abi encode for HelloWorld.sayHiVanilla(address _feeToken) (see 0x61bBe925A5D646cE074369A6335e5095Ea7abB7A on Kovan)
  const data = `0x4b327067000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeaeeeeeeeeeeeeeeeee`;

  const forwardRequest = GelatoRelaySDK.forwardRequest(
    chainId,
    target,
    data,
    NATIVE_TOKEN,
    1,
    "1000000000000000000",
    GAS,
    0,
    false,
    sponsor
  );

  const digest = GelatoRelaySDK.getForwardRequestDigestToSign(forwardRequest);

  const sponsorSignature: utils.BytesLike = utils.joinSignature(
    await wallet._signingKey().signDigest(digest)
  );

  const taskId = await GelatoRelaySDK.sendForwardRequest(
    forwardRequest,
    sponsorSignature
  );

  const status = await GelatoRelaySDK.getStatus(taskId);

  console.log(`Status for task ${taskId}: ${JSON.stringify(status)}`);
};

const metaTxRequest = async (chainId: number, target: string) => {
  const wallet = Wallet.createRandom();
  const user = await wallet.getAddress();

  console.log(`Mock wallet address: ${user}`);
  // abi encode for HelloWorld.sayHi(address _feeToken) (see 0x61bBe925A5D646cE074369A6335e5095Ea7abB7A on Kovan)
  const data = `0x4c6d2627000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`;

  const metaTxRequest = GelatoRelaySDK.metaTxRequest(
    chainId,
    target,
    data,
    NATIVE_TOKEN,
    1,
    "100000000000000000000",
    GAS,
    user,
    0
  );

  const digest = GelatoRelaySDK.getMetaTxRequestDigestToSign(metaTxRequest);

  const userSignature: utils.BytesLike = utils.joinSignature(
    await wallet._signingKey().signDigest(digest)
  );

  const taskId = await GelatoRelaySDK.sendMetaTxRequest(
    metaTxRequest,
    userSignature
  );

  const status = await GelatoRelaySDK.getStatus(taskId);

  console.log(`Status for task ${taskId}: ${JSON.stringify(status)}`);
};

const testKovan = async (): Promise<void> => {
  const chainId = 42;
  const HELLO_WORLD = "0x61bBe925A5D646cE074369A6335e5095Ea7abB7A";

  await Promise.all([
    callRequest(chainId, HELLO_WORLD),
    forwardRequest(chainId, HELLO_WORLD),
    metaTxRequest(chainId, HELLO_WORLD),
  ]);
};

const testRinkeby = async (): Promise<void> => {
  const chainId = 4;
  const HELLO_WORLD = "0xeeea839E2435873adA11d5dD4CAE6032742C0445";

  await Promise.all([
    callRequest(chainId, HELLO_WORLD),
    forwardRequest(chainId, HELLO_WORLD),
    metaTxRequest(chainId, HELLO_WORLD),
  ]);
};

const testGnosis = async (): Promise<void> => {
  const chainId = 100;
  const HELLO_WORLD = "0x3F9BBfb21E666914a5ab195C1CE02c4365A85aA5";

  await Promise.all([
    callRequest(chainId, HELLO_WORLD),
    forwardRequest(chainId, HELLO_WORLD),
    metaTxRequest(chainId, HELLO_WORLD),
  ]);
};

const testGoerli = async (): Promise<void> => {
  const chainId = 5;
  const HELLO_WORLD = "0x8580995EB790a3002A55d249e92A8B6e5d0b384a";

  await Promise.all([
    callRequest(chainId, HELLO_WORLD),
    forwardRequest(chainId, HELLO_WORLD),
    metaTxRequest(chainId, HELLO_WORLD),
  ]);
};

const testMatic = async (): Promise<void> => {
  const chainId = 137;
  const HELLO_WORLD = "0x9B79b798563e538cc326D03696B3Be38b971D282";

  await Promise.all([
    callRequest(chainId, HELLO_WORLD),
    forwardRequest(chainId, HELLO_WORLD),
    metaTxRequest(chainId, HELLO_WORLD),
  ]);
};

const testMumbai = async (): Promise<void> => {
  const chainId = 80001;
  const HELLO_WORLD = "0xE6Bc17A4AD90d03617a24E6799c0ea228E8f912F";

  await Promise.all([
    callRequest(chainId, HELLO_WORLD),
    forwardRequest(chainId, HELLO_WORLD),
    metaTxRequest(chainId, HELLO_WORLD),
  ]);
};

async function main() {
  //await testGnosis();
  //await testKovan();
  //await testGoerli();
  //await testRinkeby();
  await testMatic();
  //await testMumbai();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
