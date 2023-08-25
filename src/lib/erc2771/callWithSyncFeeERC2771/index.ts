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
  ConcurrencyOptions,
  Config,
  RelayCall,
  RelayRequestOptions,
  RelayResponse,
} from "../../types";
import {
  CallWithConcurrentERC2771Struct,
  CallWithERC2771Struct,
  CallWithSyncFeeConcurrentERC2771Request,
  CallWithSyncFeeERC2771Request,
  ERC2771Type,
  UserAuthSignature,
} from "../types";
import { getPayloadToSign, mapRequestToStruct } from "../utils";

export const relayWithCallWithSyncFeeERC2771 = async (
  payload: {
    request:
      | CallWithSyncFeeERC2771Request
      | CallWithSyncFeeConcurrentERC2771Request;
    walletOrProvider: ethers.BrowserProvider | ethers.Wallet;
    options?: RelayRequestOptions;
  },
  config: Config
): Promise<RelayResponse> => {
  try {
    const { request, walletOrProvider, options } = payload;
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

    if (request.isConcurrent) {
      const isConcurrent = true;
      const { isRelayContext, feeToken, ...callWithSyncFeeRequest } = request;
      const type = ERC2771Type.ConcurrentCallWithSyncFee;

      const parametersToOverride = await populateOptionalUserParameters(
        { request: callWithSyncFeeRequest, type, walletOrProvider },
        config
      );
      const struct = await mapRequestToStruct(
        callWithSyncFeeRequest,
        parametersToOverride
      );
      const signature = await signTypedDataV4(
        walletOrProvider,
        callWithSyncFeeRequest.user as string,
        getPayloadToSign(
          {
            struct: {
              ...struct,
              chainId: struct.chainId.toString(),
            },
            type,
            isWallet: isWallet(walletOrProvider),
          },
          config
        )
      );
      return await post<
        CallWithConcurrentERC2771Struct &
          BaseCallWithSyncFeeParams &
          RelayRequestOptions &
          UserAuthSignature &
          ConcurrencyOptions,
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
            chainId: struct.chainId.toString(),
            isConcurrent,
          },
        },
        config
      );
    } else {
      const isConcurrent = false;
      const { isRelayContext, feeToken, ...callWithSyncFeeRequest } = request;
      const type = ERC2771Type.CallWithSyncFee;

      const parametersToOverride = await populateOptionalUserParameters(
        { request: callWithSyncFeeRequest, type, walletOrProvider },
        config
      );
      const struct = await mapRequestToStruct(
        callWithSyncFeeRequest,
        parametersToOverride
      );
      const signature = await signTypedDataV4(
        walletOrProvider,
        callWithSyncFeeRequest.user as string,
        getPayloadToSign(
          {
            struct: {
              ...struct,
              chainId: struct.chainId.toString(),
              userNonce: struct.userNonce.toString(),
            },
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
          UserAuthSignature &
          ConcurrencyOptions,
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
      `GelatoRelaySDK/callWithSyncFeeERC2771: Failed with error: ${errorMessage}`
    );
  }
};
