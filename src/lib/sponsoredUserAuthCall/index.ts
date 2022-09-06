// eslint-disable-next-line import/no-named-as-default
import ethers from "ethers";

import { RelayRequestOptions, RelayResponse } from "../types";

import { sponsoredUserAuthCallWith1Balance } from "./1balance";
import { SponsoredUserAuthCallRequest } from "./types";

/**
 * @param {SponsoredUserAuthCallRequest} request - SponsoredUserAuthCallRequest to be relayed by Gelato Executors
 * @param {ethers.providers.Web3Provider} provider - Web3Provider to sign the payload
 * @param {string} sponsorApiKey - Sponsor API key
 * @param {RelayRequestOptions} [options] - Optional Relay configuration
 * @returns {Promise<RelayResponse>} Response object with taskId parameter
 *
 */
export const relayWithSponsoredUserAuthCall = async (
  request: SponsoredUserAuthCallRequest,
  provider: ethers.providers.Web3Provider,
  sponsorApiKey: string,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  return await sponsoredUserAuthCallWith1Balance(
    request,
    provider,
    sponsorApiKey,
    options
  );
};
