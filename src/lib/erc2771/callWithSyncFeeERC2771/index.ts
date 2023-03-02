import { ethers } from "ethers";

import {
  isWallet,
  populateOptionalUserParameters,
  post,
  signTypedDataV4,
} from "../../../utils";
import { isNetworkSupported } from "../../network";
import {
  BaseCallWithSyncFeeParams,
  RelayCall,
  RelayRequestOptions,
  RelayResponse,
} from "../../types";
import {
  CallWithERC2771Request,
  CallWithERC2771RequestOptionalParameters,
  CallWithERC2771Struct,
  CallWithSyncFeeERC2771Request,
  ERC2771Type,
  UserAuthSignature,
} from "../types";
import { getPayloadToSign, mapRequestToStruct } from "../utils";

export const relayWithCallWithSyncFeeERC2771 = async (
  request: CallWithSyncFeeERC2771Request,
  walletOrProvider: ethers.providers.Web3Provider | ethers.Wallet,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  try {
    if (!walletOrProvider.provider) {
      throw new Error(`Missing provider`);
    }
    const isSupported = await isNetworkSupported(Number(request.chainId));
    if (!isSupported) {
      throw new Error(`Chain id [${request.chainId}] is not supported`);
    }
    const { isRelayContext, feeToken, ...callWithSyncFeeRequest } = request;
    const parametersToOverride = await populateOptionalUserParameters<
      CallWithERC2771Request,
      CallWithERC2771RequestOptionalParameters
    >(callWithSyncFeeRequest, walletOrProvider);
    const struct = await mapRequestToStruct(
      callWithSyncFeeRequest,
      parametersToOverride
    );
    const signature = await signTypedDataV4(
      walletOrProvider,
      callWithSyncFeeRequest.user as string,
      getPayloadToSign(
        struct,
        ERC2771Type.CallWithSyncFee,
        isWallet(walletOrProvider)
      )
    );

    return await post<
      CallWithERC2771Struct &
        BaseCallWithSyncFeeParams &
        RelayRequestOptions &
        UserAuthSignature,
      RelayResponse
    >(RelayCall.CallWithSyncFeeERC2771, {
      ...struct,
      ...options,
      feeToken,
      isRelayContext: isRelayContext ?? true,
      userSignature: signature,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/callWithSyncFeeERC2771: Failed with error: ${errorMessage}`
    );
  }
};
