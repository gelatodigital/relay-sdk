import { ethers } from "ethers";

import {
  isWallet,
  populateOptionalUserParameters,
  post,
  signTypedDataV4,
} from "../../../utils";
import { isNetworkSupported } from "../../network";
import {
  ApiKey,
  Config,
  RelayCall,
  RelayRequestOptions,
  RelayResponse,
} from "../../types";
import {
  CallWithERC2771Request,
  CallWithERC2771RequestOptionalParameters,
  CallWithERC2771Struct,
  ERC2771Type,
  UserAuthSignature,
} from "../types";
import { getPayloadToSign, mapRequestToStruct } from "../utils";

export const relayWithSponsoredCallERC2771 = async (
  payload: {
    request: CallWithERC2771Request;
    walletOrProvider: ethers.providers.Web3Provider | ethers.Wallet;
    sponsorApiKey: string;
    options?: RelayRequestOptions;
  },
  config: Config
): Promise<RelayResponse> => {
  return await sponsoredCallERC2771(payload, config);
};

const sponsoredCallERC2771 = async (
  payload: {
    request: CallWithERC2771Request;
    walletOrProvider: ethers.providers.Web3Provider | ethers.Wallet;
    sponsorApiKey: string;
    options?: RelayRequestOptions;
  },
  config: Config
): Promise<RelayResponse> => {
  try {
    const { request, sponsorApiKey, walletOrProvider, options } = payload;
    if (!walletOrProvider.provider) {
      throw new Error(`Missing provider`);
    }
    const isSupported = await isNetworkSupported(
      { chainId: Number(request.chainId) },
      config
    );
    if (!isSupported) {
      throw new Error(`Chain id [${request.chainId}] is not supported`);
    }

    const parametersToOverride = await populateOptionalUserParameters<
      CallWithERC2771Request,
      CallWithERC2771RequestOptionalParameters
    >({ request, walletOrProvider }, config);
    const struct = await mapRequestToStruct(request, parametersToOverride);
    const signature = await signTypedDataV4(
      walletOrProvider,
      request.user as string,
      getPayloadToSign(
        {
          struct,
          type: ERC2771Type.SponsoredCall,
          isWallet: isWallet(walletOrProvider),
        },
        config
      )
    );

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
        },
      },
      config
    );
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/sponsoredCallERC2771: Failed with error: ${errorMessage}`
    );
  }
};
