import { BigNumber } from "ethers";
import { getAddress } from "ethers/lib/utils";

import { post } from "../../utils";
import { isNetworkSupported } from "../network";
import {
  ApiKey,
  BaseRelayParams,
  RelayCall,
  RelayRequestOptions,
  RelayResponse,
} from "../types";

import { SponsoredCallRequest } from "./types";

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
): Promise<BaseRelayParams> => {
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
    const isSupported = await isNetworkSupported(Number(request.chainId));
    if (!isSupported) {
      throw new Error(`Chain id [${request.chainId}] is not supported`);
    }
    const struct = await mapRequestToStruct(request);
    const postResponse = await post<
      BaseRelayParams & RelayRequestOptions & ApiKey,
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
