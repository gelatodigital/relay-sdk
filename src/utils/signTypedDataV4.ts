import { ethers } from "ethers";

import { SIGN_TYPED_DATA_V4 } from "../constants";
import { SponsoredCallERC2771PayloadToSign } from "../lib/erc2771/types";

import { isWallet } from "./isWallet";

export const signTypedDataV4 = async (
  walletOrProvider: ethers.providers.Web3Provider | ethers.Wallet,
  address: string,
  payload: SponsoredCallERC2771PayloadToSign
): Promise<string> => {
  if (isWallet(walletOrProvider)) {
    return await walletOrProvider._signTypedData(
      payload.domain,
      payload.types,
      payload.message
    );
  }
  // Magic Connect accepts payload as an object
  if ((walletOrProvider.provider as { isMagic: boolean }).isMagic) {
    return await walletOrProvider.send(SIGN_TYPED_DATA_V4, [address, payload]);
  }
  const signature = await walletOrProvider.send(SIGN_TYPED_DATA_V4, [
    address,
    JSON.stringify(payload),
  ]);

  // Support both versions of `eth_sign` responses
  return signature.replace(/00$/, "1b").replace(/01$/, "1c");
};
