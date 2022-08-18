import { providers } from "ethers";
import { userAuthCallWith1Balance } from "./1balance";
import { userAuthCallWithTransferFrom } from "./transferFrom";
import { PaymentMethod, RelayRequestOptions, RelaySeparator } from "../types";
import { RelayRequestWithUserSignature } from "./types";
import { UserAuthCallWith1BalanceRequest } from "./1balance/types";
import { UserAuthCallWithTransferFromRequest } from "./transferFrom/types";

export const relayWithUserSignature = async <T extends RelaySeparator>(
  request: RelayRequestWithUserSignature<T>,
  provider: providers.Web3Provider,
  options?: RelayRequestOptions
) => {
  const requestSeparator = request.relaySeparator;
  switch (requestSeparator.paymentMethod) {
    case PaymentMethod.Async:
      console.log("Async payment with user signature");
      return userAuthCallWith1Balance(
        request.relayData as UserAuthCallWith1BalanceRequest,
        provider,
        options
      );

    case PaymentMethod.Sync:
      console.log("Sync payment with user signature");
      return userAuthCallWithTransferFrom(
        request.relayData as UserAuthCallWithTransferFromRequest,
        provider,
        options
      );

    default: {
      const _exhaustiveCheck: never = requestSeparator;
      return _exhaustiveCheck;
    }
  }
};
