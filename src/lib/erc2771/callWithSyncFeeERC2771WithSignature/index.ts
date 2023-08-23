import { isConcurrentStruct, post } from "../../../utils";
import { isNetworkSupported } from "../../network";
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
  UserAuthSignature,
} from "../types";

export const callWithSyncFeeERC2771WithSignature = async (
  payload: {
    struct: CallWithERC2771Struct | CallWithConcurrentERC2771Struct;
    syncFeeParams: BaseCallWithSyncFeeParams;
    signature: string;
    options?: RelayRequestOptions;
  },
  config: Config
): Promise<RelayResponse> => {
  try {
    const { signature, struct, syncFeeParams, options } = payload;

    const isSupported = await isNetworkSupported(
      { chainId: struct.chainId },
      config
    );
    if (!isSupported) {
      throw new Error(`Chain id [${struct.chainId}] is not supported`);
    }

    if (isConcurrentStruct(struct)) {
      const isConcurrent = true;
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
            ...struct,
            ...syncFeeParams,
            ...options,
            isRelayContext: syncFeeParams.isRelayContext ?? true,
            userSignature: signature,
            chainId: struct.chainId.toString(),
            isConcurrent,
          },
        },
        config
      );
    } else {
      const isConcurrent = false;
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
            ...struct,
            ...syncFeeParams,
            ...options,
            isRelayContext: syncFeeParams.isRelayContext ?? true,
            userSignature: signature,
            chainId: struct.chainId.toString(),
            userNonce: struct.userNonce.toString(),
            isConcurrent,
          },
        },
        config
      );
    }
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/callWithSyncFeeERC2771WithSignature: Failed with error: ${errorMessage}`
    );
  }
};
