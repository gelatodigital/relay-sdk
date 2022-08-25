import { ethers, providers } from "ethers";

import { USER_NONCE_ABI, getRelayAddress } from "../constants";

export const getUserNonce = async (
  chainId: number,
  account: string,
  provider: providers.Web3Provider | ethers.providers.Provider
) => {
  const contract = new ethers.Contract(
    getRelayAddress(chainId),
    USER_NONCE_ABI,
    provider
  );
  return await contract.userNonce(account);
};
