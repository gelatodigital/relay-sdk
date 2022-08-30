import axios from "axios";

import { GELATO_RELAY_URL } from "../constants";
import { AuthCall } from "../lib/types";

import { getHttpErrorMessage } from "./getHttpErrorMessage";

export const postAuthCall = async <Request, Response>(
  authCall: AuthCall,
  request: Request
): Promise<Response> => {
  try {
    let path: string;
    switch (authCall) {
      case AuthCall.User:
        path = `${GELATO_RELAY_URL}/relays/v2/user-auth-call`;
        break;

      case AuthCall.Sponsor:
        path = `${GELATO_RELAY_URL}/relays/v2/sponsor-auth-call`;
        break;

      case AuthCall.UserSponsor:
        path = `${GELATO_RELAY_URL}/relays/v2/user-sponsor-auth-call`;
        break;

      default: {
        const _exhaustiveCheck: never = authCall;
        return _exhaustiveCheck;
      }
    }
    return (await axios.post(path, request)).data;
  } catch (error) {
    throw new Error(getHttpErrorMessage(error));
  }
};
