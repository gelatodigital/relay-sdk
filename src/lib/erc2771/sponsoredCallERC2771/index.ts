import { ethers } from "ethers";

import {
  populateOptionalUserParameters,
  postSponsoredCall,
  signTypedDataV4,
} from "../../../utils";
import { isNetworkSupported } from "../../network";
import {
  ApiKey,
  RelayCall,
  RelayRequestOptions,
  RelayResponse,
} from "../../types";
import {
  SponsoredCallERC2771Request,
  SponsoredCallERC2771RequestOptionalParameters,
  SponsoredCallERC2771Struct,
  UserAuthSignature,
} from "../types";
import { getPayloadToSign, mapRequestToStruct } from "../utils";

export const relayWithSponsoredCallERC2771 = async (
  request: SponsoredCallERC2771Request,
  provider: ethers.providers.Web3Provider,
  sponsorApiKey: string,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  return await sponsoredCallERC2771(request, provider, sponsorApiKey, options);
};

const sponsoredCallERC2771 = async (
  request: SponsoredCallERC2771Request,
  provider: ethers.providers.Web3Provider,
  sponsorApiKey: string,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  try {
    const isSupported = await isNetworkSupported(Number(request.chainId));
    if (!isSupported) {
      throw new Error(`Chain id [${request.chainId}] is not supported`);
    }

    const parametersToOverride = await populateOptionalUserParameters<
      SponsoredCallERC2771Request,
      SponsoredCallERC2771RequestOptionalParameters
    >(request, provider);
    const struct = await mapRequestToStruct(request, parametersToOverride);
    const signature = await signTypedDataV4(
      provider,
      request.user as string,
      getPayloadToSign(struct)
    );

    const postResponse = await postSponsoredCall<
      SponsoredCallERC2771Struct &
        RelayRequestOptions &
        UserAuthSignature &
        ApiKey,
      RelayResponse
    >(RelayCall.SponsoredCallERC2771, {
      ...struct,
      ...options,
      userSignature: signature,
      sponsorApiKey,
    });
    return postResponse;
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/sponsoredCallERC2771: Failed with error: ${errorMessage}`
    );
  }
};
