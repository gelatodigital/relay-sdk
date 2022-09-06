import { ethers, providers } from "ethers";

import { USER_NONCE_ABI } from "../constants";
import { PaymentType } from "../lib/types";

import { getRelayAddress } from "./getRelayAddresses";

export const getUserNonce = async (
  paymentType: PaymentType,
  chainId: number,
  account: string,
  provider: providers.Web3Provider | ethers.providers.Provider
) => {
  const address =
    paymentType === PaymentType.OneBalance ? getRelayAddress(chainId) : null;
  if (!address) {
    throw new Error(`Unsupported payment type [${paymentType}]`);
  }
  const contract = new ethers.Contract(address, USER_NONCE_ABI, provider);
  return await contract.userNonce(account);
};
