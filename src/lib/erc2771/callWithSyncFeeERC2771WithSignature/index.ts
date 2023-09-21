import { isConcurrentStruct, post } from "../../../utils";
import { isNetworkSupported } from "../../network";
import {
  ApiKey,
  BaseCallWithSyncFeeParams,
  ConcurrencyOptions,
  Config,
  Optional,
  RelayCall,
  RelayRequestOptions,
  RelayResponse,
} from "../../types";
import {
  CallWithConcurrentERC2771Struct,
  CallWithERC2771Struct,
  UserAuthSignature,
} from "../types";
import { safeTransformStruct } from "../utils/safeTransformStruct.js";

export const callWithSyncFeeERC2771WithSignature = async (
  payload: {
    struct: CallWithERC2771Struct | CallWithConcurrentERC2771Struct;
    syncFeeParams: BaseCallWithSyncFeeParams;
    signature: string;
    options?: RelayRequestOptions;
    sponsorApiKey?: string;
  },
  config: Config
): Promise<RelayResponse> => {
  try {
    const { signature, struct, syncFeeParams, options, sponsorApiKey } =
      payload;

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
          Optional<ApiKey, "sponsorApiKey"> &
          ConcurrencyOptions,
        RelayResponse
      >(
        {
          relayCall: RelayCall.CallWithSyncFeeERC2771,
          request: {
            ...safeTransformStruct(struct),
            ...syncFeeParams,
            isRelayContext: syncFeeParams.isRelayContext ?? true,
            userSignature: signature,
            isConcurrent,
            sponsorApiKey,
            gasLimit: options?.gasLimit
              ? options.gasLimit.toString()
              : undefined,
            retries: options?.retries,
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
          Optional<ApiKey, "sponsorApiKey"> &
          ConcurrencyOptions,
        RelayResponse
      >(
        {
          relayCall: RelayCall.CallWithSyncFeeERC2771,
          request: {
            ...safeTransformStruct(struct),
            ...syncFeeParams,
            isRelayContext: syncFeeParams.isRelayContext ?? true,
            userSignature: signature,
            isConcurrent,
            sponsorApiKey,
            gasLimit: options?.gasLimit
              ? options.gasLimit.toString()
              : undefined,
            retries: options?.retries,
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
