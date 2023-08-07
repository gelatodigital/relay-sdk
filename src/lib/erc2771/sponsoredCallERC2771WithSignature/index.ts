import { post } from "../../../utils";
import { isNetworkSupported } from "../../network";
import {
  ApiKey,
  Config,
  RelayCall,
  RelayRequestOptions,
  RelayResponse,
} from "../../types";
import { CallWithERC2771Struct, UserAuthSignature } from "../types";

export const sponsoredCallERC2771WithSignature = async (
  payload: {
    struct: CallWithERC2771Struct;
    signature: string;
    sponsorApiKey: string;
    options?: RelayRequestOptions;
  },
  config: Config
): Promise<RelayResponse> => {
  try {
    const { signature, sponsorApiKey, struct, options } = payload;

    const isSupported = await isNetworkSupported(
      { chainId: struct.chainId },
      config
    );
    if (!isSupported) {
      throw new Error(`Chain id [${struct.chainId}] is not supported`);
    }

    return await post<
      CallWithERC2771Struct & RelayRequestOptions & UserAuthSignature & ApiKey,
      RelayResponse
    >(
      {
        relayCall: RelayCall.SponsoredCallERC2771,
        request: {
          ...struct,
          ...options,
          userSignature: signature,
          sponsorApiKey,
          chainId: struct.chainId.toString(),
          userNonce: struct.userNonce.toString(),
        },
      },
      config
    );
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/sponsoredCallERC2771WithSignature: Failed with error: ${errorMessage}`
    );
  }
};
