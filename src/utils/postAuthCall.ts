import axios from "axios";

import { GELATO_RELAY_URL } from "../constants";
import { RelayCall } from "../lib/types";

import { getHttpErrorMessage } from "./getHttpErrorMessage";

export const postSponsoredCall = async <Request, Response>(
  relayCall: RelayCall,
  request: Request
): Promise<Response> => {
  try {
    let path: string;
    switch (relayCall) {
      case RelayCall.Sponsored:
        path = `${GELATO_RELAY_URL}/relays/v2/sponsored-call`;
        break;

      case RelayCall.SponsoredCallERC2771:
        path = `${GELATO_RELAY_URL}/relays/v2/sponsored-call-erc2771`;
        break;

      default: {
        const _exhaustiveCheck: never = relayCall;
        return _exhaustiveCheck;
      }
    }
    return (await axios.post(path, request)).data;
  } catch (error) {
    throw new Error(getHttpErrorMessage(error));
  }
};
