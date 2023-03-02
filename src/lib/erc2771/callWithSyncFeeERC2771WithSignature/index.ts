import { post } from "../../../utils";
import { isNetworkSupported } from "../../network";
import {
  BaseCallWithSyncFeeParams,
  RelayCall,
  RelayRequestOptions,
  RelayResponse,
} from "../../types";
import { CallWithERC2771Struct, UserAuthSignature } from "../types";

export const callWithSyncFeeERC2771WithSignature = async (
  struct: CallWithERC2771Struct,
  syncFeeParams: BaseCallWithSyncFeeParams,
  signature: string,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  try {
    const isSupported = await isNetworkSupported(Number(struct.chainId));
    if (!isSupported) {
      throw new Error(`Chain id [${struct.chainId}] is not supported`);
    }

    return await post<
      CallWithERC2771Struct &
        BaseCallWithSyncFeeParams &
        RelayRequestOptions &
        UserAuthSignature,
      RelayResponse
    >(RelayCall.CallWithSyncFeeERC2771, {
      ...struct,
      ...syncFeeParams,
      ...options,
      userSignature: signature,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/callWithSyncFeeERC2771WithSignature: Failed with error: ${errorMessage}`
    );
  }
};
