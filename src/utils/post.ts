import { Config, RelayCall, SafeRequestPayload } from "../lib/types";

import { axiosInstance } from "./axios";
import { getHttpErrorMessage } from "./getHttpErrorMessage";

export const post = async <Request, Response>(
  payload: { relayCall: RelayCall; request: SafeRequestPayload<Request> },
  config: Config
): Promise<Response> => {
  try {
    const { relayCall, request } = payload;
    let path: string;
    switch (relayCall) {
      case RelayCall.CallWithSyncFee:
        path = `${config.url}/relays/v2/call-with-sync-fee`;
        break;

      case RelayCall.CallWithSyncFeeERC2771:
        path = `${config.url}/relays/v2/call-with-sync-fee-erc2771`;
        break;

      case RelayCall.SponsoredCall:
        path = `${config.url}/relays/v2/sponsored-call`;
        break;

      case RelayCall.SponsoredCallERC2771:
        path = `${config.url}/relays/v2/sponsored-call-erc2771`;
        break;

      default: {
        const _exhaustiveCheck: never = relayCall;
        return _exhaustiveCheck;
      }
    }
    return (await axiosInstance.post(path, request)).data;
  } catch (error) {
    throw new Error(getHttpErrorMessage(error));
  }
};
