import { ethers, providers } from "ethers";

import { USER_NONCE_ABI } from "../constants";

import { getRelayAddress } from "./getRelayAddresses";

export const getUserNonce = async (
  chainId: number,
  account: string,
  provider: providers.Web3Provider | ethers.providers.Provider
) => {
  const address = getRelayAddress(chainId);
  const contract = new ethers.Contract(address, USER_NONCE_ABI, provider);
  return await contract.userNonce(account);
};
