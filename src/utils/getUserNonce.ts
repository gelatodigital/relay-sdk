import { ethers } from "ethers";

import { USER_NONCE_ABI } from "../constants";
import { Config } from "../lib/types";
import { ERC2771Type } from "../lib/erc2771/types";

import { getGelatoRelayERC2771Address } from "./relayAddress";

export const getUserNonce = async (
  payload: {
    account: string;
    chainId: number;
    type: ERC2771Type;
    walletOrProvider: ethers.providers.Web3Provider | ethers.Wallet;
  },
  config: Config
) => {
  const { account, chainId, type, walletOrProvider } = payload;
  const contract = new ethers.Contract(
    getGelatoRelayERC2771Address({ chainId, type }, config),
    USER_NONCE_ABI,
    walletOrProvider
  );
  return await contract.userNonce(account);
};
