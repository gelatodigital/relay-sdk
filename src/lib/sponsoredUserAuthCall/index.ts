// eslint-disable-next-line import/no-named-as-default
import ethers, { BigNumber, providers } from "ethers";
import { getAddress } from "ethers/lib/utils";

import {
  getEIP712Domain,
  populateOptionalUserParameters,
  signTypedDataV4,
  postAuthCall,
} from "../../utils";
import { isNetworkSupported } from "../network";
import {
  ApiKey,
  EIP712_DOMAIN_TYPE_DATA,
  RelayCall,
  RelayContract,
  RelayRequestOptions,
  RelayResponse,
} from "../types";

import {
  EIP712_SPONSORED_USER_AUTH_CALL_TYPE_DATA,
  SponsoredUserAuthCallPayloadToSign,
  SponsoredUserAuthCallRequest,
  SponsoredUserAuthCallRequestOptionalParameters,
  SponsoredUserAuthCallStruct,
  UserAuthSignature,
} from "./types";

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
  return await sponsoredUserAuthCall(request, provider, sponsorApiKey, options);
};

const getPayloadToSign = (
  struct: SponsoredUserAuthCallStruct
): SponsoredUserAuthCallPayloadToSign => {
  const domain = getEIP712Domain(
    struct.chainId as number,
    RelayContract.GelatoRelay
  );
  return {
    domain,
    types: {
      ...EIP712_SPONSORED_USER_AUTH_CALL_TYPE_DATA,
      ...EIP712_DOMAIN_TYPE_DATA,
    },
    primaryType: "SponsoredUserAuthCall",
    message: struct,
  };
};

const mapRequestToStruct = async (
  request: SponsoredUserAuthCallRequest,
  override: Partial<SponsoredUserAuthCallRequestOptionalParameters>
): Promise<SponsoredUserAuthCallStruct> => {
  if (!override.userNonce && !request.userNonce) {
    throw new Error(`userNonce is not found in the request, nor fetched`);
  }
  if (!override.userDeadline && !request.userDeadline) {
    throw new Error(`userDeadline is not found in the request, nor fetched`);
  }
  return {
    userNonce:
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      override.userNonce ?? BigNumber.from(request.userNonce!).toString(),
    userDeadline:
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      override.userDeadline ?? BigNumber.from(request.userDeadline!).toString(),
    chainId: BigNumber.from(request.chainId).toString(),
    target: getAddress(request.target as string),
    data: request.data,
    user: getAddress(request.user as string),
  };
};

const sponsoredUserAuthCall = async (
  request: SponsoredUserAuthCallRequest,
  provider: providers.Web3Provider,
  sponsorApiKey: string,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  try {
    const isSupported = await isNetworkSupported(Number(request.chainId));
    if (!isSupported) {
      throw new Error(`Chain id [${request.chainId}] is not supported`);
    }
    const parametersToOverride = await populateOptionalUserParameters<
      SponsoredUserAuthCallRequest,
      SponsoredUserAuthCallRequestOptionalParameters
    >(request, provider);
    const struct = await mapRequestToStruct(request, parametersToOverride);
    const signature = await signTypedDataV4(
      provider,
      request.user as string,
      JSON.stringify(getPayloadToSign(struct))
    );
    const postResponse = await postAuthCall<
      SponsoredUserAuthCallStruct &
        RelayRequestOptions &
        UserAuthSignature &
        ApiKey,
      RelayResponse
    >(RelayCall.SponsoredUserAuth, {
      ...struct,
      ...options,
      userSignature: signature,
      sponsorApiKey,
    });
    return postResponse;
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/sponsoredUserAuthCall: Failed with error: ${errorMessage}`
    );
  }
};
