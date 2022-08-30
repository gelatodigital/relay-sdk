import ethers from "ethers";

import { PaymentType, RelayRequestOptions, RelayResponse } from "../types";

import { userAuthCallWith1Balance } from "./1balance";
import { userAuthCallWithTransferFrom } from "./transferFrom";
import { UserAuthCallWith1BalanceRequest } from "./1balance/types";
import { UserAuthCallWithTransferFromRequest } from "./transferFrom/types";
import { RelayRequestWithUserSignature } from "./types";

/**
 * @function
 * @template PT
 * @extends {PaymentType}
 * @param {PT} paymentType - PaymentType.OneBalance or PaymentType.TransferFrom
 * @param {RelayRequestWithUserSignature<PT>} request - Depending on the paymentType, UserAuthCallWith1Balance or UserAuthCallWithTransferFrom request to be relayed by Gelato Executors
 * @param {ethers.providers.Web3Provider} provider - Web3Provider to sign the payload
 * @param {RelayRequestOptions} options - Optional Relay configuration
 * @returns {Promise<RelayResponse>} Response object with taskId parameter
 *
 */
export const relayWithUserSignature = async <PT extends PaymentType>(
  paymentType: PT,
  request: RelayRequestWithUserSignature<PT>,
  provider: ethers.providers.Web3Provider,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  switch (paymentType) {
    case PaymentType.OneBalance:
      return await userAuthCallWith1Balance(
        request as UserAuthCallWith1BalanceRequest,
        provider,
        options
      );

    case PaymentType.TransferFrom:
      return await userAuthCallWithTransferFrom(
        request as UserAuthCallWithTransferFromRequest,
        provider,
        options
      );

    default: {
      const _exhaustiveCheck: never = paymentType;
      return _exhaustiveCheck;
    }
  }
};
