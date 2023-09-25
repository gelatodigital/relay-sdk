import { ethers } from "ethers";

import { USER_NONCE_ABI } from "../constants";
import { Config, SignerOrProvider } from "../lib/types";
import { ERC2771Type } from "../lib/erc2771/types";

import { getGelatoRelayERC2771Address } from "./relayAddress";
import { getProviderChainId } from "./getProviderChainId";

export const getUserNonce = async (
  payload: {
    account: string;
    type: ERC2771Type;
    signerOrProvider: SignerOrProvider;
  },
  config: Config
): Promise<bigint> => {
  const { account, type, signerOrProvider } = payload;
  if (!signerOrProvider.provider) {
    throw new Error(`Missing provider`);
  }

  const chainId = await getProviderChainId(signerOrProvider);

  const contract = new ethers.Contract(
    getGelatoRelayERC2771Address({ chainId, type }, config),
    USER_NONCE_ABI,
    signerOrProvider
  );
  return (await contract.userNonce(account)) as bigint;
};
