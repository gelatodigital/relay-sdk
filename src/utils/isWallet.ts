import { ethers } from "ethers";

export const isWallet = (
  walletOrProvider?: ethers.providers.Web3Provider | ethers.Wallet
): walletOrProvider is ethers.Wallet => {
  if (!walletOrProvider) {
    return false;
  }
  return (walletOrProvider as { _isSigner: boolean })._isSigner;
};
