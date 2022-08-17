import { ethers, providers } from "ethers";
import { ABI, getRelayAddress } from "../constants";

export const getUserNonce = async (
  chainId: number,
  account: string,
  provider: providers.Web3Provider
) => {

  const contract = new ethers.Contract(getRelayAddress(chainId), ABI, provider);
  return await contract.userNonce(account);
};
