import axios from "axios";

import { GELATO_RELAY_URL } from "../constants";
import { AuthCall } from "../lib/types";

import { getHttpErrorMessage } from "./getHttpErrorMessage";

export const postAuthCall = async <Request, Response>(
  authCall: AuthCall,
  request: Request
): Promise<Response> => {
  try {
    switch (authCall) {
      case AuthCall.User:
        return (
          await axios.post(
            `${GELATO_RELAY_URL}/relays/v2/user-auth-call`,
            request
          )
        ).data;

      case AuthCall.Sponsor:
        return (
          await axios.post(
            `${GELATO_RELAY_URL}/relays/v2/sponsor-auth-call`,
            request
          )
        ).data;

      case AuthCall.UserSponsor:
        return (
          await axios.post(
            `${GELATO_RELAY_URL}/relays/v2/user-sponsor-auth-call`,
            request
          )
        ).data;

      default: {
        const _exhaustiveCheck: never = authCall;
        return _exhaustiveCheck;
      }
    }
  } catch (error) {
    throw new Error(getHttpErrorMessage(error));
  }
};
