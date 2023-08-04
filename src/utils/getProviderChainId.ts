import { ethers } from "ethers";

import { isWallet } from "./isWallet";

export const getProviderChainId = async (
  walletOrProvider: ethers.BrowserProvider | ethers.Wallet
): Promise<bigint> => {
  let provider: ethers.Provider;
  if (isWallet(walletOrProvider)) {
    if (!walletOrProvider.provider) {
      throw new Error(`Missing provider`);
    }
    provider = walletOrProvider.provider;
  } else {
    provider = walletOrProvider;
  }

  const { chainId } = await provider.getNetwork();

  return chainId;
};
