import axios from "axios";

import {
  DEFAULT_INTERNAL_ERROR_MESSAGE,
  GELATO_RELAY_URL,
} from "../../constants";
import { RelayRequestOptions, RelayResponse } from "../types";

import { CallWithSyncFeeRequest } from "./types";

/**
 * @param {CallWithSyncFeeRequest} request - CallWithSyncFee request to be relayed by Gelato Executors
 * @param {RelayRequestOptions} options - Optional Relay configuration
 * @returns {Promise<RelayResponse>} Response object with taskId parameter
 *
 */
export const relayWithSyncFee = async (
  request: CallWithSyncFeeRequest,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  try {
    const response = await axios.post(
      `${GELATO_RELAY_URL}/relays/v2/call-with-sync-fee`,
      { ...request, ...options }
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ??
      error.message ??
      DEFAULT_INTERNAL_ERROR_MESSAGE;
    throw new Error(
      `GelatoRelaySDK/relayWithSyncFee: Failed with error: ${errorMessage}`
    );
  }
};
