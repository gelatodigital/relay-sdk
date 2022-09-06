import { RelayRequestOptions, RelayResponse } from "../types";

import { sponsoredCallWith1Balance as sponsoredCallWith1Balance } from "./1balance";
import { SponsoredCallRequest } from "./types";

/**
 * @function
 * @param {SponsoredCallRequest} request SponsoredCallRequest to be relayed by the Gelato Executors.
 * @param {string} sponsorApiKey Sponsor API key to be used for the call
 * @param {RelayRequestOptions} [options] Optional Relay configuration
 * @returns {Promise<RelayResponse>} Response object with taskId parameter
 *
 */
export const relayWithSponsoredCall = async (
  request: SponsoredCallRequest,
  sponsorApiKey: string,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  return await sponsoredCallWith1Balance(
    request as SponsoredCallRequest,
    sponsorApiKey,
    options
  );
};
