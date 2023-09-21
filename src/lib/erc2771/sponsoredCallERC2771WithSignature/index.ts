import { isConcurrentStruct, post } from "../../../utils";
import { isNetworkSupported } from "../../network";
import {
  ApiKey,
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
import { safeTransformStruct } from "../utils/safeTransformStruct.js";

export const sponsoredCallERC2771WithSignature = async (
  payload: {
    struct: CallWithERC2771Struct | CallWithConcurrentERC2771Struct;
    signature: string;
    sponsorApiKey: string;
    options?: RelayRequestOptions;
  },
  config: Config
): Promise<RelayResponse> => {
  try {
    const { signature, sponsorApiKey, struct, options } = payload;

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
          RelayRequestOptions &
          UserAuthSignature &
          ApiKey &
          ConcurrencyOptions,
        RelayResponse
      >(
        {
          relayCall: RelayCall.SponsoredCallERC2771,
          request: {
            ...safeTransformStruct(struct),
            userSignature: signature,
            sponsorApiKey,
            isConcurrent,
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
          RelayRequestOptions &
          UserAuthSignature &
          ApiKey &
          ConcurrencyOptions,
        RelayResponse
      >(
        {
          relayCall: RelayCall.SponsoredCallERC2771,
          request: {
            ...safeTransformStruct(struct),
            userSignature: signature,
            sponsorApiKey,
            isConcurrent,
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
      `GelatoRelaySDK/sponsoredCallERC2771WithSignature: Failed with error: ${errorMessage}`
    );
  }
};
