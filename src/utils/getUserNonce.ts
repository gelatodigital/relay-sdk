import { ethers } from "ethers";

import { USER_NONCE_ABI } from "../constants";
import { Config } from "../lib/types";
import { ERC2771Type } from "../lib/erc2771/types";

import { getGelatoRelayERC2771Address } from "./relayAddress";
import { getProviderChainId } from "./getProviderChainId";

export const getUserNonce = async (
  payload: {
    account: string;
    type: ERC2771Type;
    walletOrProvider: ethers.BrowserProvider | ethers.Wallet;
  },
  config: Config
): Promise<bigint> => {
  const { account, type, walletOrProvider } = payload;

  const chainId = await getProviderChainId(walletOrProvider);

  const contract = new ethers.Contract(
    getGelatoRelayERC2771Address({ chainId, type }, config),
    USER_NONCE_ABI,
    walletOrProvider
  );
  return (await contract.userNonce(account)) as bigint;
};
