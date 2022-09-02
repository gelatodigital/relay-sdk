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
      case AuthCall.Sponsor:
        path = `${GELATO_RELAY_URL}/relays/v2/sponsored-call`;
        break;

      case AuthCall.UserSponsor:
        path = `${GELATO_RELAY_URL}/relays/v2/sponsored-user-auth-call`;
        break;

      default: {
        const _exhaustiveCheck: never = authCall as never;
        return _exhaustiveCheck;
      }
    }
    return (await axios.post(path, request)).data;
  } catch (error) {
    throw new Error(getHttpErrorMessage(error));
  }
};
