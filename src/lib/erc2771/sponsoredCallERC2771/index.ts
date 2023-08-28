import { ethers } from "ethers";

import {
  getProviderChainId,
  isConcurrentRequest,
  post,
  signTypedDataV4,
} from "../../../utils";
import { isNetworkSupported } from "../../network";
import {
  ApiKey,
  ConcurrencyOptions,
  Config,
  RelayCall,
  RelayRequestOptions,
  RelayResponse,
} from "../../types";
import {
  CallWithConcurrentERC2771Request,
  CallWithConcurrentERC2771Struct,
  CallWithERC2771Request,
  CallWithERC2771Struct,
  ERC2771Type,
  UserAuthSignature,
} from "../types";
import { populatePayloadToSign } from "../utils";

export const relayWithSponsoredCallERC2771 = async (
  payload: {
    request: CallWithERC2771Request | CallWithConcurrentERC2771Request;
    walletOrProvider: ethers.BrowserProvider | ethers.Wallet;
    sponsorApiKey: string;
    options?: RelayRequestOptions;
  },
  config: Config
): Promise<RelayResponse> => {
  return await sponsoredCallERC2771(payload, config);
};

const sponsoredCallERC2771 = async (
  payload: {
    request: CallWithERC2771Request | CallWithConcurrentERC2771Request;
    walletOrProvider: ethers.BrowserProvider | ethers.Wallet;
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

    const { chainId } = request;
    const isSupported = await isNetworkSupported({ chainId }, config);
    if (!isSupported) {
      throw new Error(`Chain id [${chainId.toString()}] is not supported`);
    }

    const providerChainId = await getProviderChainId(walletOrProvider);
    if (chainId !== providerChainId) {
      throw new Error(
        `Request and provider chain id mismatch. Request: [${chainId.toString()}], provider: [${providerChainId.toString()}]`
      );
    }

    if (isConcurrentRequest(request)) {
      const isConcurrent = true;
      const type = ERC2771Type.ConcurrentSponsoredCall;
      const { struct, typedData } = await populatePayloadToSign(
        { request, type, walletOrProvider },
        config
      );

      const signature = await signTypedDataV4(
        walletOrProvider,
        request.user as string,
        typedData
      );
      return await post<
        CallWithConcurrentERC2771Struct &
          RelayRequestOptions &
          UserAuthSignature &
          ApiKey &
          ConcurrencyOptions,
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
            isConcurrent,
          },
        },
        config
      );
    } else {
      const isConcurrent = false;
      const type = ERC2771Type.SponsoredCall;
      const { struct, typedData } = await populatePayloadToSign(
        { request, type, walletOrProvider },
        config
      );

      const signature = await signTypedDataV4(
        walletOrProvider,
        request.user as string,
        typedData
      );
      return await post<
        CallWithERC2771Struct &
          RelayRequestOptions &
          UserAuthSignature &
          ApiKey &
          ConcurrencyOptions,
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
            isConcurrent,
          },
        },
        config
      );
    }
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/sponsoredCallERC2771: Failed with error: ${errorMessage}`
    );
  }
};
