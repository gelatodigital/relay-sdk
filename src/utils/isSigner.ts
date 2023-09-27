import { ethers } from "ethers";

import { SignerOrProvider } from "../lib/types";

export const isSigner = (
  signerOrProvider: SignerOrProvider
): signerOrProvider is ethers.Signer => {
  return "signTransaction" in signerOrProvider;
};
