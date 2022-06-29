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

  console.log(
    `forwardRequest: Mock PK: ${await wallet._signingKey().privateKey}`
  );
  console.log(`forwardRequest: Mock wallet address: ${sponsor}`);
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
  console.log(
    `forwardRequest: Mock forwardRequest: ${JSON.stringify(forwardRequest)}`
  );

  const digest = GelatoRelaySDK.getForwardRequestDigestToSign(forwardRequest);

  const sponsorSignature: utils.BytesLike = utils.joinSignature(
    await wallet._signingKey().signDigest(digest)
  );

  console.log(`forwardRequest: Mock sponsorSignature: ${sponsorSignature}`);

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

const testEvmos = async (): Promise<void> => {
  const chainId = 9001;
  const HELLO_WORLD = "0x953c67EFFFB961244E72bcE8b887a6ead29c45AF";

  await Promise.all([
    callRequest(chainId, HELLO_WORLD),
    forwardRequest(chainId, HELLO_WORLD),
    metaTxRequest(chainId, HELLO_WORLD),
  ]);
};

const testBsc = async (): Promise<void> => {
  const chainId = 56;
  const HELLO_WORLD = "0x3F9BBfb21E666914a5ab195C1CE02c4365A85aA5";

  await Promise.all([
    callRequest(chainId, HELLO_WORLD),
    forwardRequest(chainId, HELLO_WORLD),
    metaTxRequest(chainId, HELLO_WORLD),
  ]);
};

const testMainnet = async (): Promise<void> => {
  const chainId = 1;
  const HELLO_WORLD = "0x16aaA06cE56CC6251A8b813c0c9208223fd460E0";

  await Promise.all([
    callRequest(chainId, HELLO_WORLD),
    forwardRequest(chainId, HELLO_WORLD),
    metaTxRequest(chainId, HELLO_WORLD),
  ]);
};

const testAlfajores = async (): Promise<void> => {
  const chainId = 44787;
  const HELLO_WORLD = "0x9561aCdf04C2B639dFfeCB357438e7B3eD979C5C";

  await Promise.all([
    callRequest(chainId, HELLO_WORLD),
    forwardRequest(chainId, HELLO_WORLD),
    metaTxRequest(chainId, HELLO_WORLD),
  ]);
};

const estimateMaxFee = async (
  chainId: number,
  feeToken: string,
  gasLimit: number
): Promise<string | undefined> => {
  try {
    const whitelistedFeeTokens: string[] = (
      await GelatoRelaySDK.getFeeTokens(chainId)
    ).map((token) => {
      return token.toLowerCase();
    });

    console.log(
      `Whitelisted fee tokens for chainId ${chainId}: ${JSON.stringify(
        whitelistedFeeTokens
      )}`
    );

    if (!whitelistedFeeTokens.includes(feeToken.toLowerCase())) {
      throw new Error(`feeToken ${feeToken} not whitelisted`);
    }

    // Add a constant buffer to gasLimit, since the tx will be routed through
    // Gelato's smart contracts
    const totalGasLimit = gasLimit + GelatoRelaySDK.GELATO_GAS_BUFFER;

    const maxFee = await GelatoRelaySDK.getMaxFeeEstimate(
      chainId,
      feeToken,
      totalGasLimit
    );

    console.log(`maxFee estimate for feeToken ${feeToken}: ${maxFee}`);

    return maxFee;
  } catch (error) {
    const errorMsg = (error as Error).message ?? String(error);

    console.log(`estimateMaxFee: Failed with error: ${errorMsg}`);

    return undefined;
  }
};

const testForwardRequestWalletPayload = async () => {
  const chainId = 80001;
  const target = "0xE6Bc17A4AD90d03617a24E6799c0ea228E8f912F";

  const wallet = Wallet.createRandom();
  const sponsor = await wallet.getAddress();

  console.log(
    `forwardRequest: Mock PK: ${await wallet._signingKey().privateKey}`
  );
  console.log(`forwardRequest: Mock wallet address: ${sponsor}`);
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

  const { domain, types, value } =
    GelatoRelaySDK.getForwardRequestWalletPayloadToSign(forwardRequest);

  const signature = await wallet._signTypedData(domain, types, value);

  console.log(`wallet signature: ${signature}`);

  const digest = GelatoRelaySDK.getForwardRequestDigestToSign(forwardRequest);

  const sponsorSignature: utils.BytesLike = utils.joinSignature(
    await wallet._signingKey().signDigest(digest)
  );

  console.log(`wallet sponsorSignature: ${sponsorSignature}`);

  if (signature !== sponsorSignature) {
    throw new Error("testForwardRequestWalletPayload: Invalid signature");
  }
};

const testMetaTxRequestWalletPayload = async () => {
  const chainId = 80001;
  const target = "0xE6Bc17A4AD90d03617a24E6799c0ea228E8f912F";

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

  const { domain, types, value } =
    GelatoRelaySDK.getMetaTxRequestWalletPayloadToSign(metaTxRequest);

  const signature = await wallet._signTypedData(domain, types, value);

  console.log(`wallet signature: ${signature}`);

  const digest = GelatoRelaySDK.getMetaTxRequestDigestToSign(metaTxRequest);

  const sponsorSignature: utils.BytesLike = utils.joinSignature(
    await wallet._signingKey().signDigest(digest)
  );

  console.log(`wallet sponsorSignature: ${sponsorSignature}`);

  if (signature !== sponsorSignature) {
    throw new Error("testMetaTxRequestWalletPayload: Invalid signature");
  }
};

async function main() {
  await testGnosis();
  await testKovan();
  await testGoerli();
  await testRinkeby();
  await testMatic();
  await testMumbai();
  await testEvmos();
  await testBsc();
  await testAlfajores();
  await testMainnet();
  await estimateMaxFee(5, NATIVE_TOKEN, 100000);
  await testForwardRequestWalletPayload();
  await testMetaTxRequestWalletPayload();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
