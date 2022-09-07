import { BigNumber } from "ethers";
import { getAddress } from "ethers/lib/utils";

import { postAuthCall } from "../../utils";
import {
  ApiKey,
  RelayCall,
  RelayRequestOptions,
  RelayResponse,
} from "../types";

import { SponsoredCallRequest, SponsoredCallStruct } from "./types";

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
  return await sponsoredCall(
    request as SponsoredCallRequest,
    sponsorApiKey,
    options
  );
};

const mapRequestToStruct = async (
  request: SponsoredCallRequest
): Promise<SponsoredCallStruct> => {
  return {
    chainId: BigNumber.from(request.chainId).toString(),
    target: getAddress(request.target as string),
    data: request.data,
  };
};

const sponsoredCall = async (
  request: SponsoredCallRequest,
  sponsorApiKey: string,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  try {
    const struct = await mapRequestToStruct(request);
    const postResponse = await postAuthCall<
      SponsoredCallStruct & RelayRequestOptions & ApiKey,
      RelayResponse
    >(RelayCall.Sponsored, {
      ...struct,
      ...options,
      sponsorApiKey,
    });
    return postResponse;
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/sponsoredCall: Failed with error: ${errorMessage}`
    );
  }
};
