import axios from "axios";

import { GELATO_RELAY_URL } from "../../constants";
import { RelayRequestOptions, RelayResponse } from "../types";

import { CallWithSyncFeeRequest } from "./types";

export const relayWithSyncFee = async (
  request: CallWithSyncFeeRequest,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  try {
    const response = await axios.post(
      `${GELATO_RELAY_URL}/v2/relays/call-with-sync-fee`,
      { ...request, ...options }
    );
    return response.data;
  } catch (error) {
    const errorMessage = (error as Error).message ?? String(error);
    throw new Error(
      `GelatoRelaySDK/relayWithSyncFee: Failed with error: ${errorMessage}`
    );
  }
};
