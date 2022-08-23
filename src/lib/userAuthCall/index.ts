import { providers } from "ethers";

import { PaymentType, RelayRequestOptions, RelaySeparator } from "../types";

import { userAuthCallWith1Balance } from "./1balance";
import { userAuthCallWithTransferFrom } from "./transferFrom";
import { RelayRequestWithUserSignature } from "./types";
import { UserAuthCallWith1BalanceRequest } from "./1balance/types";
import { UserAuthCallWithTransferFromRequest } from "./transferFrom/types";

export const relayWithUserSignature = async <T extends RelaySeparator>(
  request: RelayRequestWithUserSignature<T>,
  provider: providers.Web3Provider,
  options?: RelayRequestOptions
) => {
  const requestSeparator = request.relaySeparator;
  switch (requestSeparator.paymentType) {
    case PaymentType.OneBalance:
      return userAuthCallWith1Balance(
        request.relayData as UserAuthCallWith1BalanceRequest,
        provider,
        options
      );

    case PaymentType.TransferFrom:
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
