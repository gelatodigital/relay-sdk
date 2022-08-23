import { OneBalanceSDK } from "@gelatonetwork/1balance-sdk";
import { getAddress } from "ethers/lib/utils";

export const getFeeToken = async (chainId: number, address: string) => {
  const sponsorBalance = await OneBalanceSDK.getSponsorBalance(
    chainId,
    address
  );
  return getAddress(sponsorBalance.token.address);
};
