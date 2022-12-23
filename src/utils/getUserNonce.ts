import { ethers, providers } from "ethers";

import { GELATO_RELAY_ERC2771_ADDRESS, USER_NONCE_ABI } from "../constants";

export const getUserNonce = async (
  account: string,
  provider: providers.Web3Provider | ethers.providers.Provider
) => {
  const contract = new ethers.Contract(
    GELATO_RELAY_ERC2771_ADDRESS,
    USER_NONCE_ABI,
    provider
  );
  return await contract.userNonce(account);
};
