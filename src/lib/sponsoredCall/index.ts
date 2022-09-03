import { RelayRequestOptions, RelayResponse } from "../types";

import { sponsoredCallWith1Balance as sponsoredCallWith1Balance } from "./1balance";
import { SponsoredCallWith1BalanceRequest } from "./1balance/types";
import { SponsoredCallRequest } from "./types";

/**
 * @function
 * @param {SponsoredCallRequest} request object that contains the chainId, the target contract address, the data to be executed. The method will pay the system using 1Balance.
 * @param {sponsorApiKey} Sponsor API key to be used for the call
 * @param {RelayRequestOptions} [options] - Optional Relay configuration
 * @returns {Promise<RelayResponse>} Response object with taskId parameter
 *
 */
export const relayWithSponsoredCall = async (
  request: SponsoredCallRequest,
  sponsorApiKey: string,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  return await sponsoredCallWith1Balance(
    request as SponsoredCallWith1BalanceRequest,
    sponsorApiKey,
    options
  );
};
