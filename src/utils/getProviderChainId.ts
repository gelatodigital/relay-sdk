import { Provider } from "ethers";

import { SignerOrProvider } from "../lib/types";

import { isSigner } from "./isSigner";

export const getProviderChainId = async (
  signerOrProvider: SignerOrProvider
): Promise<bigint> => {
  let provider: Provider;
  if (isSigner(signerOrProvider)) {
    if (!signerOrProvider.provider) {
      throw new Error(`Missing provider`);
    }
    provider = signerOrProvider.provider;
  } else {
    provider = signerOrProvider;
  }

  const { chainId } = await provider.getNetwork();

  return chainId;
};
