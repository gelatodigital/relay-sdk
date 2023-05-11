import { ethers } from "ethers";

import {
  getProviderChainId,
  isWallet,
  populateOptionalUserParameters,
  post,
  signTypedDataV4,
} from "../../../utils";
import { isNetworkSupported } from "../../network";
import {
  BaseCallWithSyncFeeParams,
  Config,
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
    options?: RelayRequestOptions;
  },
  config: Config
): Promise<RelayResponse> => {
  try {
    const { request, walletOrProvider, options } = payload;
    if (!walletOrProvider.provider) {
      throw new Error(`Missing provider`);
    }

    const chainId = Number(request.chainId);
    const isSupported = await isNetworkSupported({ chainId }, config);
    if (!isSupported) {
      throw new Error(`Chain id [${request.chainId}] is not supported`);
    }

    const providerChainId = await getProviderChainId(walletOrProvider);
    if (chainId !== providerChainId) {
      throw new Error(
        `Request and provider chain id mismatch. Request: [${chainId}], provider: [${providerChainId}]`
      );
    }

    const { isRelayContext, feeToken, ...callWithSyncFeeRequest } = request;

    const type = ERC2771Type.CallWithSyncFee;

    const parametersToOverride = await populateOptionalUserParameters<
      CallWithERC2771Request,
      CallWithERC2771RequestOptionalParameters
    >({ request: callWithSyncFeeRequest, type, walletOrProvider }, config);

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
          type,
          isWallet: isWallet(walletOrProvider),
        },
        config
      )
    );

    return await post<
      CallWithERC2771Struct &
        BaseCallWithSyncFeeParams &
        RelayRequestOptions &
        UserAuthSignature,
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
