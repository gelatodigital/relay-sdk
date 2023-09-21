import { getHttpErrorMessage, post } from "../../utils";
import { isNetworkSupported } from "../network";
import {
  ApiKey,
  Config,
  Optional,
  RelayCall,
  RelayRequestOptions,
  RelayResponse,
} from "../types";

import { CallWithSyncFeeRequest } from "./types";

export const relayWithSyncFee = async (
  payload: {
    request: CallWithSyncFeeRequest;
    sponsorApiKey?: string;
    options?: RelayRequestOptions;
  },
  config: Config
): Promise<RelayResponse> => {
  try {
    const { request, options, sponsorApiKey } = payload;
    const isSupported = await isNetworkSupported(
      { chainId: request.chainId },
      config
    );
    if (!isSupported) {
      throw new Error(`Chain id [${request.chainId}] is not supported`);
    }
    return await post<
      CallWithSyncFeeRequest &
        RelayRequestOptions &
        Optional<ApiKey, "sponsorApiKey">,
      RelayResponse
    >(
      {
        relayCall: RelayCall.CallWithSyncFee,
        request: {
          ...request,
          isRelayContext: request.isRelayContext ?? true,
          sponsorApiKey,
          chainId: request.chainId.toString(),
          gasLimit: options?.gasLimit ? options.gasLimit.toString() : undefined,
          retries: options?.retries,
        },
      },
      config
    );
  } catch (error) {
    throw new Error(
      `GelatoRelaySDK/relayWithSyncFee: Failed with error: ${getHttpErrorMessage(
        error
      )}`
    );
  }
};
