// eslint-disable-next-line import/no-named-as-default
import ethers from "ethers";

import { PaymentType, RelayRequestOptions, RelayResponse } from "../types";

import { userAuthCallWith1Balance } from "./1balance";
import { UserAuthCallWith1BalanceRequest } from "./1balance/types";
import { RelayRequestWithUserSignature } from "./types";

/**
 * @function
 * @template PT
 * @extends {PaymentType}
 * @param {RelayRequestWithUserSignature<PT>} request - Depending on the paymentType, UserAuthCallWith1Balance or UserAuthCallWithTransferFrom request to be relayed by Gelato Executors
 * @param {ethers.providers.Web3Provider} provider - Web3Provider to sign the payload
 * @param {RelayRequestOptions} [options] - Optional Relay configuration
 * @returns {Promise<RelayResponse>} Response object with taskId parameter
 *
 */
export const relayWithUserSignature = async <PT extends PaymentType>(
  request: RelayRequestWithUserSignature<PT>,
  provider: ethers.providers.Web3Provider,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  return await userAuthCallWith1Balance(
    request as UserAuthCallWith1BalanceRequest,
    provider,
    options
  );
};
