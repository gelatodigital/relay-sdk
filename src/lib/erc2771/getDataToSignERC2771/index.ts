import { ethers } from "ethers";

import {
  getProviderChainId,
  isWallet,
  populateOptionalUserParameters,
} from "../../../utils";
import { isNetworkSupported } from "../../network";
import { Config } from "../../types";
import {
  CallWithERC2771Request,
  CallWithERC2771RequestOptionalParameters,
  ERC2771Type,
  DataToSign,
} from "../types";
import { getPayloadToSign, mapRequestToStruct } from "../utils";

export const getDataToSignERC2771 = async (
  payload: {
    request: CallWithERC2771Request;
    walletOrProvider: ethers.providers.Web3Provider | ethers.Wallet;
    type: ERC2771Type;
  },
  config: Config
): Promise<DataToSign> => {
  try {
    const { request, type, walletOrProvider } = payload;
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

    const parametersToOverride = await populateOptionalUserParameters<
      CallWithERC2771Request,
      CallWithERC2771RequestOptionalParameters
    >({ request, type, walletOrProvider }, config);

    const struct = await mapRequestToStruct(request, parametersToOverride);

    const payloadToSign = getPayloadToSign(
      { struct, type, isWallet: isWallet(walletOrProvider) },
      config
    );

    return {
      struct,
      payloadToSign,
    };
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/getSignatureDataERC2771: Failed with error: ${errorMessage}`
    );
  }
};
