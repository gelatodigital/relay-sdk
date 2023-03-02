import { ethers } from "ethers";

import {
  isWallet,
  populateOptionalUserParameters,
  signTypedDataV4,
} from "../../../utils";
import { isNetworkSupported } from "../../network";
import {
  SignatureData,
  CallWithERC2771Request,
  CallWithERC2771RequestOptionalParameters,
  ERC2771Type,
} from "../types";
import { getPayloadToSign, mapRequestToStruct } from "../utils";

export const getSignatureDataERC2771 = async (
  request: CallWithERC2771Request,
  walletOrProvider: ethers.providers.Web3Provider | ethers.Wallet,
  type: ERC2771Type
): Promise<SignatureData> => {
  try {
    if (!walletOrProvider.provider) {
      throw new Error(`Missing provider`);
    }
    const isSupported = await isNetworkSupported(Number(request.chainId));
    if (!isSupported) {
      throw new Error(`Chain id [${request.chainId}] is not supported`);
    }

    const parametersToOverride = await populateOptionalUserParameters<
      CallWithERC2771Request,
      CallWithERC2771RequestOptionalParameters
    >(request, walletOrProvider);
    const struct = await mapRequestToStruct(request, parametersToOverride);
    const signature = await signTypedDataV4(
      walletOrProvider,
      request.user as string,
      getPayloadToSign(struct, type, isWallet(walletOrProvider))
    );
    return {
      struct,
      signature,
    };
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/getSignatureDataERC2771: Failed with error: ${errorMessage}`
    );
  }
};
