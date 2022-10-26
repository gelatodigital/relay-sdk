import dotenv from "dotenv";
import { Interface } from "ethers/lib/utils";
dotenv.config({ path: ".env" });

import { GelatoRelaySDK } from "../src";
import { SponsoredCallRequest } from "../src/lib/sponsoredCall/types";
import { CallWithSyncFeeRequest } from "../src/lib/callWithSyncFee/types";

const sponsorApiKey = "YOUR_API_KEY";
const NATIVE_TOKEN = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

const networks = [
  {
    chainId: 5, // Goerli
    helloWorldAddress: "0x30d97B13e29B0cd42e6ebd48dbD9063465bF1997",
    helloWorldSyncFee: "0xEEeBe2F778AA186e88dCf2FEb8f8231565769C27",
  },
  {
    chainId: 137, // Polygon
    helloWorldAddress: "0x30d97B13e29B0cd42e6ebd48dbD9063465bF1997",
    helloWorldSyncFee: "0xEEeBe2F778AA186e88dCf2FEb8f8231565769C27",
  },
  {
    chainId: 420, // Optimism Goerli
    helloWorldAddress: "0x30d97B13e29B0cd42e6ebd48dbD9063465bF1997",
    helloWorldSyncFee: "0xEEeBe2F778AA186e88dCf2FEb8f8231565769C27",
  },
  {
    chainId: 44787, // Celo Alfajores
    helloWorldAddress: "0x30d97B13e29B0cd42e6ebd48dbD9063465bF1997",
    helloWorldSyncFee: "0xEEeBe2F778AA186e88dCf2FEb8f8231565769C27",
  },
];

const Counter = new Interface([
  "function increment() external",
  "function incrementContext() external",
]);
const callWithSyncFee = async (
  chainId: number,
  target: string,
  data: string
) => {
  const request: CallWithSyncFeeRequest = {
    chainId,
    target,
    data,
    feeToken: NATIVE_TOKEN,
  };

  console.log(`Testing callWithSyncFee for chainId: ${chainId}`);
  const relayResponse = await GelatoRelaySDK.relayWithSyncFee(request);
  console.log(relayResponse);
  const status = await GelatoRelaySDK.getTaskStatus(relayResponse.taskId);

  console.log(
    `Status for task ${relayResponse.taskId}: ${JSON.stringify(status)}`
  );
};

const sponsoredCall = async (chainId: number, target: string, data: string) => {
  const request: SponsoredCallRequest = {
    chainId,
    target,
    data,
  };

  console.log(`Testing relayWithSponsoredCall for chainId: ${chainId}`);
  const relayResponse = await GelatoRelaySDK.relayWithSponsoredCall(
    request,
    sponsorApiKey
  );
  console.log(relayResponse);
  const status = await GelatoRelaySDK.getTaskStatus(relayResponse.taskId);

  console.log(
    `Status for task ${relayResponse.taskId}: ${JSON.stringify(status)}`
  );
};

async function main() {
  const syncFeeCalldata = Counter.encodeFunctionData("increment", []);
  const data = Counter.encodeFunctionData("incrementContext", []);

  for (const network of networks) {
    await callWithSyncFee(
      network.chainId,
      network.helloWorldSyncFee,
      syncFeeCalldata
    );
    await sponsoredCall(network.chainId, network.helloWorldAddress, data);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
