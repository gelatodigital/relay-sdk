import { Signer } from "ethers";

import { SignerOrProvider } from "../lib/types";

export const isSigner = (
  signerOrProvider: SignerOrProvider
): signerOrProvider is Signer => {
  return "signTransaction" in signerOrProvider;
};
