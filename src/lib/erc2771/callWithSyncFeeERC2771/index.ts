import { ethers } from "ethers";

import { post } from "../../../utils";
import {
  BaseCallWithSyncFeeParams,
  ConcurrencyOptions,
  Config,
  RelayCall,
  RelayRequestOptions,
  RelayResponse,
} from "../../types";
import {
  CallWithConcurrentERC2771Struct,
  CallWithERC2771Struct,
  CallWithSyncFeeConcurrentERC2771Request,
  CallWithSyncFeeERC2771Request,
  ERC2771Type,
  UserAuthSignature,
} from "../types";
import { getSignatureDataERC2771 } from "../getSignatureDataERC2771/index.js";
import { safeTransformStruct } from "../utils/safeTransformStruct.js";

export const relayWithCallWithSyncFeeERC2771 = async (
  payload: {
    request:
      | CallWithSyncFeeERC2771Request
      | CallWithSyncFeeConcurrentERC2771Request;
    walletOrProvider: ethers.BrowserProvider | ethers.Wallet;
    options?: RelayRequestOptions;
  },
  config: Config
): Promise<RelayResponse> => {
  try {
    const { request, walletOrProvider, options } = payload;
    if (!walletOrProvider.provider) {
      throw new Error(`Missing provider`);
    }

    if (request.isConcurrent) {
      const isConcurrent = true;
      const { isRelayContext, feeToken } = request;
      const type = ERC2771Type.ConcurrentCallWithSyncFee;

      const { struct, signature } = await getSignatureDataERC2771(
        { request, walletOrProvider, type },
        config
      );

      return await post<
        CallWithConcurrentERC2771Struct &
          BaseCallWithSyncFeeParams &
          RelayRequestOptions &
          UserAuthSignature &
          ConcurrencyOptions,
        RelayResponse
      >(
        {
          relayCall: RelayCall.CallWithSyncFeeERC2771,
          request: {
            ...safeTransformStruct(struct),
            ...options,
            feeToken,
            isRelayContext: isRelayContext ?? true,
            userSignature: signature,
            isConcurrent,
          },
        },
        config
      );
    } else {
      const isConcurrent = false;
      const { isRelayContext, feeToken } = request;
      const type = ERC2771Type.CallWithSyncFee;

      const { struct, signature } = await getSignatureDataERC2771(
        { request, walletOrProvider, type },
        config
      );

      return await post<
        CallWithERC2771Struct &
          BaseCallWithSyncFeeParams &
          RelayRequestOptions &
          UserAuthSignature &
          ConcurrencyOptions,
        RelayResponse
      >(
        {
          relayCall: RelayCall.CallWithSyncFeeERC2771,
          request: {
            ...safeTransformStruct(struct),
            ...options,
            feeToken,
            isRelayContext: isRelayContext ?? true,
            userSignature: signature,
            isConcurrent,
          },
        },
        config
      );
    }
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/callWithSyncFeeERC2771: Failed with error: ${errorMessage}`
    );
  }
};
