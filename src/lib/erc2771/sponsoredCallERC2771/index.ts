import { ethers } from "ethers";

import { isConcurrentRequest, post } from "../../../utils";
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
import { getSignatureDataERC2771 } from "../getSignatureDataERC2771/index.js";

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

    if (isConcurrentRequest(request)) {
      const isConcurrent = true;
      const type = ERC2771Type.ConcurrentSponsoredCall;

      const { struct, signature } = await getSignatureDataERC2771(
        {
          request,
          walletOrProvider,
          type,
        },
        config
      );

      const concurrentStruct = struct as CallWithConcurrentERC2771Struct;
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
            ...concurrentStruct,
            ...options,
            userSignature: signature,
            sponsorApiKey,
            chainId: concurrentStruct.chainId.toString(),
            isConcurrent,
          },
        },
        config
      );
    } else {
      const isConcurrent = false;
      const type = ERC2771Type.SponsoredCall;

      const { struct, signature } = await getSignatureDataERC2771(
        {
          request,
          walletOrProvider,
          type,
        },
        config
      );
      const sequentialStruct = struct as CallWithERC2771Struct;

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
            ...sequentialStruct,
            ...options,
            userSignature: signature,
            sponsorApiKey,
            chainId: sequentialStruct.chainId.toString(),
            userNonce: sequentialStruct.userNonce.toString(),
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
