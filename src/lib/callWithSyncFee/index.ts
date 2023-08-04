import { getHttpErrorMessage, post } from "../../utils";
import { isNetworkSupported } from "../network";
import {
  Config,
  RelayCall,
  RelayRequestOptions,
  RelayResponse,
} from "../types";

import { CallWithSyncFeeRequest } from "./types";

export const relayWithSyncFee = async (
  payload: {
    request: CallWithSyncFeeRequest;
    options?: RelayRequestOptions;
  },
  config: Config
): Promise<RelayResponse> => {
  try {
    const { request, options } = payload;
    const isSupported = await isNetworkSupported(
      { chainId: request.chainId },
      config
    );
    if (!isSupported) {
      throw new Error(`Chain id [${request.chainId}] is not supported`);
    }
    return await post<
      CallWithSyncFeeRequest & RelayRequestOptions,
      RelayResponse
    >(
      {
        relayCall: RelayCall.CallWithSyncFee,
        request: {
          ...request,
          isRelayContext: request.isRelayContext ?? true,
          ...options,
          chainId: request.chainId.toString(),
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
