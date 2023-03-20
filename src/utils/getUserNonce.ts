import { ethers } from "ethers";
import { getAddress } from "ethers/lib/utils";

import { USER_NONCE_ABI } from "../constants";
import { Config } from "../lib/types";

export const getUserNonce = async (
  payload: {
    account: string;
    walletOrProvider: ethers.providers.Web3Provider | ethers.Wallet;
  },
  config: Config
) => {
  const { account, walletOrProvider } = payload;
  const contract = new ethers.Contract(
    getAddress(config.contract.relayERC2771),
    USER_NONCE_ABI,
    walletOrProvider
  );
  return await contract.userNonce(account);
};
