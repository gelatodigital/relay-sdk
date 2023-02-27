import { ethers } from "ethers";

import { GELATO_RELAY_ERC2771_ADDRESS, USER_NONCE_ABI } from "../constants";

export const getUserNonce = async (
  account: string,
  walletOrProvider: ethers.providers.Web3Provider | ethers.Wallet
) => {
  const contract = new ethers.Contract(
    GELATO_RELAY_ERC2771_ADDRESS,
    USER_NONCE_ABI,
    walletOrProvider
  );
  return await contract.userNonce(account);
};
