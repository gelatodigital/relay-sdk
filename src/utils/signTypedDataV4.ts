import { providers } from "ethers";

import { SIGN_TYPED_DATA_V4 } from "../constants";
import { SponsoredCallERC2771PayloadToSign } from "../lib/erc2771/types";

export const signTypedDataV4 = async (
  provider: providers.Web3Provider,
  address: string,
  payload: SponsoredCallERC2771PayloadToSign
): Promise<string> => {
  // Magic Connect accepts payload as an object
  if ((provider.provider as { isMagic: boolean }).isMagic) {
    return await provider.send(SIGN_TYPED_DATA_V4, [address, payload]);
  }
  return await provider.send(SIGN_TYPED_DATA_V4, [
    address,
    JSON.stringify(payload),
  ]);
};
