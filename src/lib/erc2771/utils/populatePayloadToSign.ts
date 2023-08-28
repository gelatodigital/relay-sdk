import { ethers } from "ethers";

import {
  CallWithConcurrentERC2771Request,
  CallWithERC2771Request,
  ConcurrentPayloadToSign,
  ERC2771Type,
  PayloadToSign,
  SequentialPayloadToSign,
} from "../types";
import { Config } from "../../types";
import {
  isConcurrentRequest,
  isWallet,
  populateOptionalUserParameters,
} from "../../../utils";

import { mapRequestToStruct } from "./mapRequestToStruct";
import { getPayloadToSign } from "./getPayloadToSign";
import { safeTransformStruct } from "./safeTransformStruct";

export async function populatePayloadToSign(
  payload: {
    request: CallWithConcurrentERC2771Request;
    type:
      | ERC2771Type.ConcurrentCallWithSyncFee
      | ERC2771Type.ConcurrentSponsoredCall;
    walletOrProvider?: ethers.BrowserProvider | ethers.Wallet;
  },

  config: Config
): Promise<ConcurrentPayloadToSign>;

export async function populatePayloadToSign(
  payload: {
    request: CallWithERC2771Request;
    type: ERC2771Type.CallWithSyncFee | ERC2771Type.SponsoredCall;
    walletOrProvider?: ethers.BrowserProvider | ethers.Wallet;
  },

  config: Config
): Promise<SequentialPayloadToSign>;

export async function populatePayloadToSign(
  payload: {
    request: CallWithConcurrentERC2771Request | CallWithERC2771Request;
    type: ERC2771Type;
    walletOrProvider?: ethers.BrowserProvider | ethers.Wallet;
  },

  config: Config
): Promise<PayloadToSign> {
  const { request, walletOrProvider } = payload;
  if (isConcurrentRequest(request)) {
    const type = payload.type as
      | ERC2771Type.ConcurrentCallWithSyncFee
      | ERC2771Type.ConcurrentSponsoredCall;
    const parametersToOverride = await populateOptionalUserParameters(
      {
        request,
        type,
        walletOrProvider,
      },
      config
    );

    const struct = await mapRequestToStruct(request, parametersToOverride);

    const safeStruct = safeTransformStruct(struct);
    const typedData = getPayloadToSign(
      {
        struct: safeStruct,
        type,
        isWallet: walletOrProvider ? isWallet(walletOrProvider) : undefined,
      },
      config
    );
    return {
      struct,
      typedData,
    };
  } else {
    const type = payload.type as
      | ERC2771Type.CallWithSyncFee
      | ERC2771Type.SponsoredCall;
    const parametersToOverride = await populateOptionalUserParameters(
      {
        request,
        type,
        walletOrProvider,
      },
      config
    );

    const struct = await mapRequestToStruct(request, parametersToOverride);

    const safeStruct = safeTransformStruct(struct);
    const typedData = getPayloadToSign(
      {
        struct: safeStruct,
        type,
        isWallet: walletOrProvider ? isWallet(walletOrProvider) : undefined,
      },
      config
    );
    return {
      struct,
      typedData,
    };
  }
}
