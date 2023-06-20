import { ethers } from "ethers";

import { post } from "../../../utils";
import {
  BaseCallWithSyncFeeParams,
  Config,
  RelayCall,
  RelayRequestOptions,
  RelayResponse,
} from "../../types";
import {
  CallWithERC2771Struct,
  CallWithSyncFeeERC2771Request,
  ERC2771Type,
  UserAuthSignature,
} from "../types";
import { getSignatureDataERC2771 } from "../getSignatureDataERC2771/index.js";

export const relayWithCallWithSyncFeeERC2771 = async (
  payload: {
    request: CallWithSyncFeeERC2771Request;
    walletOrProvider: ethers.providers.Web3Provider | ethers.Wallet;
    options?: RelayRequestOptions;
  },
  config: Config
): Promise<RelayResponse> => {
  try {
    const { request, walletOrProvider, options } = payload;

    const { isRelayContext, feeToken } = request;

    const type = ERC2771Type.CallWithSyncFee;

    const signatureData = await getSignatureDataERC2771(
      {
        request,
        walletOrProvider,
        type,
      },
      config
    );

    return await post<
      CallWithERC2771Struct &
        BaseCallWithSyncFeeParams &
        RelayRequestOptions &
        UserAuthSignature,
      RelayResponse
    >(
      {
        relayCall: RelayCall.CallWithSyncFeeERC2771,
        request: {
          ...signatureData.struct,
          ...options,
          feeToken,
          isRelayContext: isRelayContext ?? true,
          userSignature: signatureData.signature,
        },
      },
      config
    );
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/callWithSyncFeeERC2771: Failed with error: ${errorMessage}`
    );
  }
};
