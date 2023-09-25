import { SIGN_TYPED_DATA_V4 } from "../constants";
import {
  CallWithSyncFeeERC2771PayloadToSign,
  SponsoredCallERC2771PayloadToSign,
  SponsoredCallConcurrentERC2771PayloadToSign,
  CallWithSyncFeeConcurrentERC2771PayloadToSign,
} from "../lib/erc2771/types";
import { SignerOrProvider } from "../lib/types";

import { isSigner } from "./isSigner";

export const signTypedDataV4 = async (
  signerOrProvider: SignerOrProvider,
  address: string,
  payload:
    | SponsoredCallERC2771PayloadToSign
    | CallWithSyncFeeERC2771PayloadToSign
    | SponsoredCallConcurrentERC2771PayloadToSign
    | CallWithSyncFeeConcurrentERC2771PayloadToSign
): Promise<string> => {
  if (isSigner(signerOrProvider)) {
    return await signerOrProvider.signTypedData(
      payload.domain,
      payload.types,
      payload.message
    );
  }
  // Magic Connect accepts payload as an object
  if ((signerOrProvider.provider as unknown as { isMagic: boolean }).isMagic) {
    return await signerOrProvider.send(SIGN_TYPED_DATA_V4, [address, payload]);
  }
  const signature = await signerOrProvider.send(SIGN_TYPED_DATA_V4, [
    address,
    JSON.stringify(payload),
  ]);

  // Support both versions of `eth_sign` responses
  return signature.replace(/00$/, "1b").replace(/01$/, "1c");
};
