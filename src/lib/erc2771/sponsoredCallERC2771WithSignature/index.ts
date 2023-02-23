import { postSponsoredCall } from "../../../utils";
import { isNetworkSupported } from "../../network";
import {
  ApiKey,
  RelayCall,
  RelayRequestOptions,
  RelayResponse,
} from "../../types";
import { SponsoredCallERC2771Struct, UserAuthSignature } from "../types";

export const sponsoredCallERC2771WithSignature = async (
  struct: SponsoredCallERC2771Struct,
  signature: string,
  sponsorApiKey: string,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  try {
    const isSupported = await isNetworkSupported(Number(struct.chainId));
    if (!isSupported) {
      throw new Error(`Chain id [${struct.chainId}] is not supported`);
    }

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
      `GelatoRelaySDK/sponsoredCallERC2771WithSignature: Failed with error: ${errorMessage}`
    );
  }
};
