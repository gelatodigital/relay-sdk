//import { utils, Wallet } from "ethers";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { GelatoRelaySDK } from "../src";
import { SponsoredCallRequest } from "../src/lib/sponsoredCall/types";
import { PaymentType } from "../src/lib/types";

const sponsorApiKey = "YOUR_API_KEY";
const networks = [
  {
    chainId: 5,
    helloWorldAddress: "0x8580995EB790a3002A55d249e92A8B6e5d0b384a",
  },
];

const sponsoredCall = async (chainId: number, target: string, data: string) => {
  const request: SponsoredCallRequest<PaymentType.OneBalance> = {
    chainId,
    target,
    data,
  };

  console.log(`Testing chainId: ${chainId}`);
  const relayResponse = await GelatoRelaySDK.relayWithSponsor(
    request,
    sponsorApiKey
  );
  console.log(relayResponse);
  const status = await GelatoRelaySDK.getTaskStatus(relayResponse.taskId);

  console.log(
    `Status for task ${relayResponse.taskId}: ${JSON.stringify(status)}`
  );
};

const testNetwork = async (chainId: number, address: string): Promise<void> => {
  const data = `0x4c6d2627000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`;

  await Promise.all([sponsoredCall(chainId, address, data)]);
};

async function main() {
  for (const network of networks) {
    await testNetwork(network.chainId, network.helloWorldAddress);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
