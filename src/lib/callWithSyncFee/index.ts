import { getHttpErrorMessage, post } from "../../utils";
import { isNetworkSupported } from "../network";
import { RelayCall, RelayRequestOptions, RelayResponse } from "../types";

import { CallWithSyncFeeRequest } from "./types";

export const relayWithSyncFee = async (
  request: CallWithSyncFeeRequest,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  try {
    const isSupported = await isNetworkSupported(Number(request.chainId));
    if (!isSupported) {
      throw new Error(`Chain id [${request.chainId}] is not supported`);
    }
    return await post<
      CallWithSyncFeeRequest & RelayRequestOptions,
      RelayResponse
    >(RelayCall.CallWithSyncFee, {
      ...request,
      isRelayContext: request.isRelayContext ?? true,
      ...options,
    });
  } catch (error) {
    throw new Error(
      `GelatoRelaySDK/relayWithSyncFee: Failed with error: ${getHttpErrorMessage(
        error
      )}`
    );
  }
};
