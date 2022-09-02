import { Wallet } from "ethers";
import dotenv from "dotenv";
import { Interface } from "ethers/lib/utils";
dotenv.config({ path: ".env" });

import { GelatoRelaySDK } from "../src";
import { SponsoredCallRequest } from "../src/lib/sponsoredCall/types";
import { SponsoredUserAuthCallRequest } from "../src/lib/sponsoredUserAuthCall/1balance/types";
import { PaymentType } from "../src/lib/types";
import { JsonRpcProvider, Provider } from "@ethersproject/providers";

const sponsorApiKey = "YOUR_API_KEY";
const networks = [
  {
    chainId: 5,
    helloWorldAddress: "0x30d97B13e29B0cd42e6ebd48dbD9063465bF1997",
  },
];

const Counter = new Interface([
  "function increment() external",
  "function incrementContext() external",
]);

const sponsoredCall = async (chainId: number, target: string, data: string) => {
  const request: SponsoredCallRequest<PaymentType.OneBalance> = {
    chainId,
    target,
    data,
  };

  console.log(`Testing relayWithSponsoredCall for chainId: ${chainId}`);
  const relayResponse = await GelatoRelaySDK.relayWithSponsoredCall(
    request,
    sponsorApiKey
  );
  /*console.log(relayResponse);
  const status = await GelatoRelaySDK.getTaskStatus(relayResponse.taskId);

  console.log(
    `Status for task ${relayResponse.taskId}: ${JSON.stringify(status)}`
  ); */
};

const sponsoredUserCall = async (
  chainId: number,
  target: string,
  data: string,
  provider: Provider
) => {
  const wallet = Wallet.createRandom().connect(provider);
  const user = await wallet.getAddress();

  console.log(`User address: ${user}`);
  const userNonce = 0;
  const request: SponsoredUserAuthCallRequest = {
    chainId,
    target,
    data,
    user,
    userNonce,
  };

  const userSignature = await GelatoRelaySDK.generateUserSponsorSignature(
    request,
    wallet
  );

  console.log(`Testing relayWithSponsoredUserAuthCall for chainId: ${chainId}`);
  const relayResponse = await GelatoRelaySDK.relayWithSponsoredUserAuthCall(
    request,
    userSignature.signature,
    sponsorApiKey
  );
  console.log(relayResponse);
  const status = await GelatoRelaySDK.getTaskStatus(relayResponse.taskId);

  console.log(
    `Status for task ${relayResponse.taskId}: ${JSON.stringify(status)}`
  );
};

async function main() {
  const data = Counter.encodeFunctionData("incrementContext", []);

  for (const network of networks) {
    await sponsoredCall(network.chainId, network.helloWorldAddress, data);
    /*await sponsoredUserCall(
      network.chainId,
      network.helloWorldAddress,
      data,
      new JsonRpcProvider(network.provider)
    );*/
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
