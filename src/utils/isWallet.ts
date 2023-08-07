import { ethers } from "ethers";

export const isWallet = (
  walletOrProvider: ethers.BrowserProvider | ethers.Wallet
): walletOrProvider is ethers.Wallet => {
  return "signTransaction" in walletOrProvider;
};
