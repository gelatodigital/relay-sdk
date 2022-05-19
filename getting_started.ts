import { Wallet, utils } from "ethers";
import { GelatoRelaySDK } from "./src";

const forwardRequestExample = async () => {
  // Goerli
  const chainId = 5;
  // HELLO WORLD smart contract on Goerli
  const target = "0x8580995EB790a3002A55d249e92A8B6e5d0b384a";
  const NATIVE_TOKEN = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  // Create Mock wallet
  const wallet = Wallet.createRandom();
  const sponsor = await wallet.getAddress();

  console.log(`Mock PK: ${await wallet._signingKey().privateKey}`);
  console.log(`Mock wallet address: ${sponsor}`);
  // abi encode for HelloWorld.sayHiVanilla(address _feeToken)
  const data = `0x4b327067000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeaeeeeeeeeeeeeeeeee`;
  // Async Gas Tank payment model (won't be enforced on testnets, hence no need to deposit into Gelato's Gas Tank smart contract)
  const paymentType = 1;
  // Maximum fee that sponsor is willing to pay worth of NATIVE_TOKEN
  const maxFee = "1000000000000000000";
  // Gas limit
  const gas = "200000";
  // We do not enforce smart contract nonces to simplify the example.
  // In reality, this decision depends whether or not target address already implements
  // replay protection. (More info in the docs)
  const sponsorNonce = 0;
  const enforceSponsorNonce = false;
  // Only relevant when enforceSponsorNonce=true
  const enforceSponsorNonceOrdering = false;

  // Build ForwardRequest object
  const forwardRequest = GelatoRelaySDK.forwardRequest(
    chainId,
    target,
    data,
    NATIVE_TOKEN,
    paymentType,
    maxFee,
    gas,
    sponsorNonce,
    enforceSponsorNonce,
    sponsor
  );

  // Get EIP-712 hash (aka digest) of forwardRequest
  const digest = GelatoRelaySDK.getForwardRequestDigestToSign(forwardRequest);

  // Sign digest using Mock private key
  const sponsorSignature: utils.BytesLike = utils.joinSignature(
    await wallet._signingKey().signDigest(digest)
  );

  // Send forwardRequest and its sponsorSignature to Gelato Relay API
  await GelatoRelaySDK.sendForwardRequest(forwardRequest, sponsorSignature);

  console.log("ForwardRequest submitted!");
};

forwardRequestExample();
