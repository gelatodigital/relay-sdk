import { ethers, providers } from "ethers";

import {
  USER_NONCE_ABI,
  getRelayAddress,
  getRelayWithTransferFromAddress,
} from "../constants";
import { PaymentType } from "../lib";

export const getUserNonce = async (
  paymentType: PaymentType,
  chainId: number,
  account: string,
  provider: providers.Web3Provider | ethers.providers.Provider
) => {
  const address =
    paymentType === PaymentType.OneBalance
      ? getRelayAddress(chainId)
      : paymentType === PaymentType.TransferFrom
      ? getRelayWithTransferFromAddress(chainId)
      : null;
  if (!address) {
    throw new Error(`Unsupported payment type [${paymentType}]`);
  }
  const contract = new ethers.Contract(address, USER_NONCE_ABI, provider);
  return await contract.userNonce(account);
};
