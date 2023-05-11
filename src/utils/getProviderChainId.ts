import { ethers } from "ethers";

import { isWallet } from "./isWallet";

export const getProviderChainId = async (
  walletOrProvider: ethers.providers.Web3Provider | ethers.Wallet
): Promise<number> => {
  let provider: ethers.providers.Provider;
  if (isWallet(walletOrProvider)) {
    provider = walletOrProvider.provider;
  } else {
    provider = walletOrProvider;
  }

  const { chainId } = await provider.getNetwork();

  return chainId;
};
