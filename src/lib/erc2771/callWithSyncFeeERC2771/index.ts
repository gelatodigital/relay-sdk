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
  BaseCallWithSyncFeeParams,
  Config,
  Optional,
  RelayCall,
  RelayRequestOptions,
  RelayResponse,
} from "../../types";
import {
  CallWithERC2771Request,
  CallWithERC2771RequestOptionalParameters,
  CallWithERC2771Struct,
  CallWithSyncFeeERC2771Request,
  ERC2771Type,
  UserAuthSignature,
} from "../types";
import { getPayloadToSign, mapRequestToStruct } from "../utils";

export const relayWithCallWithSyncFeeERC2771 = async (
  payload: {
    request: CallWithSyncFeeERC2771Request;
    walletOrProvider: ethers.providers.Web3Provider | ethers.Wallet;
    sponsorApiKey?: string;
    options?: RelayRequestOptions;
  },
  config: Config
): Promise<RelayResponse> => {
  try {
    const { request, walletOrProvider, options, sponsorApiKey } = payload;
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
    const { isRelayContext, feeToken, ...callWithSyncFeeRequest } = request;
    const parametersToOverride = await populateOptionalUserParameters<
      CallWithERC2771Request,
      CallWithERC2771RequestOptionalParameters
    >({ request: callWithSyncFeeRequest, walletOrProvider }, config);
    const struct = await mapRequestToStruct(
      callWithSyncFeeRequest,
      parametersToOverride
    );
    const signature = await signTypedDataV4(
      walletOrProvider,
      callWithSyncFeeRequest.user as string,
      getPayloadToSign(
        {
          struct,
          type: ERC2771Type.CallWithSyncFee,
          isWallet: isWallet(walletOrProvider),
        },
        config
      )
    );

    return await post<
      CallWithERC2771Struct &
        BaseCallWithSyncFeeParams &
        RelayRequestOptions &
        UserAuthSignature &
        Optional<ApiKey, "sponsorApiKey">,
      RelayResponse
    >(
      {
        relayCall: RelayCall.CallWithSyncFeeERC2771,
        request: {
          ...struct,
          ...options,
          feeToken,
          isRelayContext: isRelayContext ?? true,
          userSignature: signature,
          sponsorApiKey,
        },
      },
      config
    );
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/callWithSyncFeeERC2771: Failed with error: ${errorMessage}`
    );
  }
};
