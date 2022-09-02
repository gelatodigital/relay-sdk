import { PaymentType, RelayRequestOptions, RelayResponse } from "../types";

import { sponsoredCallWith1Balance as sponsoredCallWith1Balance } from "./1balance";
import { SponsoredCallWith1BalanceRequest } from "./1balance/types";
import { SponsoredCallRequest } from "./types";

/**
 * @function
 * @template PT
 * @extends {PaymentType}
 * @param {SponsoredCallRequest<PT>} request - Depending on the paymentType, SponsoredCallWith1Balance request or future payment types
 * @param {sponsorApiKey} Sponsor API key to be used for the call
 * @param {RelayRequestOptions} [options] - Optional Relay configuration
 * @returns {Promise<RelayResponse>} Response object with taskId parameter
 *
 */
export const relayWithSponsor = async <PT extends PaymentType>(
  request: SponsoredCallRequest<PT>,
  sponsorApiKey: string,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  return await sponsoredCallWith1Balance(
    request as SponsoredCallWith1BalanceRequest,
    sponsorApiKey,
    options
  );
};
