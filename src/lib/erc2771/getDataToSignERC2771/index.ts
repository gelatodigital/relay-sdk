import { ethers } from "ethers";

import { isWallet, populateOptionalUserParameters } from "../../../utils";
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
    type: ERC2771Type;
    walletOrProvider?: ethers.providers.Web3Provider | ethers.Wallet;
  },
  config: Config
): Promise<DataToSign> => {
  try {
    const { request, type, walletOrProvider } = payload;

    const chainId = Number(request.chainId);
    const isSupported = await isNetworkSupported({ chainId }, config);
    if (!isSupported) {
      throw new Error(`Chain id [${request.chainId}] is not supported`);
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
