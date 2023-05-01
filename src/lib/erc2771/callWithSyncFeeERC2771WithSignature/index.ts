import { post } from "../../../utils";
import { isNetworkSupported } from "../../network";
import {
  BaseCallWithSyncFeeParams,
  Config,
  RelayCall,
  RelayRequestOptions,
  RelayResponse,
} from "../../types";
import { CallWithERC2771Struct, UserAuthSignature } from "../types";

export const callWithSyncFeeERC2771WithSignature = async (
  payload: {
    struct: CallWithERC2771Struct;
    syncFeeParams: BaseCallWithSyncFeeParams;
    signature: string;
    options?: RelayRequestOptions;
  },
  config: Config
): Promise<RelayResponse> => {
  try {
    const { signature, struct, syncFeeParams, options } = payload;

    const isSupported = await isNetworkSupported(
      { chainId: Number(struct.chainId) },
      config
    );
    if (!isSupported) {
      throw new Error(`Chain id [${struct.chainId}] is not supported`);
    }

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
          ...struct,
          ...syncFeeParams,
          ...options,
          isRelayContext: syncFeeParams.isRelayContext ?? true,
          userSignature: signature,
        },
      },
      config
    );
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/callWithSyncFeeERC2771WithSignature: Failed with error: ${errorMessage}`
    );
  }
};
