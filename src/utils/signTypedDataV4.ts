import { Wallet } from "ethers";

import { SIGN_TYPED_DATA_V4 } from "../constants";
import {
  SponsoredCallERC2771PayloadToSign,
  WalletOrProvider,
} from "../lib/sponsoredCallERC2771/types";

export const signTypedDataV4 = async (
  provider: WalletOrProvider,
  address: string,
  payload: SponsoredCallERC2771PayloadToSign
): Promise<string> => {
  if (provider instanceof Wallet) {
    // All properties on a domain are optional
    return await provider._signTypedData(
      payload.domain,
      payload.types,
      payload.message
    );
  }
  // Magic Connect accepts payload as an object
  if ((provider.provider as { isMagic: boolean }).isMagic) {
    return await provider.send(SIGN_TYPED_DATA_V4, [address, payload]);
  }
  return await provider.send(SIGN_TYPED_DATA_V4, [
    address,
    JSON.stringify(payload),
  ]);
};
