import { BigNumber, ethers } from "ethers";

import { DEFAULT_DEADLINE_GAP } from "../constants";
import {
  CallWithERC2771Request,
  CallWithERC2771RequestOptionalParameters,
  ERC2771Type,
} from "../lib/erc2771/types";
import { Config } from "../lib/types";

import { calculateDeadline } from "./calculateDeadline";
import { getUserNonce } from "./getUserNonce";
import { getProviderChainId } from "./getProviderChainId.js";

export const populateOptionalUserParameters = async <
  Request extends CallWithERC2771Request,
  OptionalParameters extends CallWithERC2771RequestOptionalParameters
>(
  payload: {
    request: Request;
    type: ERC2771Type;
    walletOrProvider?: ethers.providers.Web3Provider | ethers.Wallet;
  },
  config: Config
): Promise<Partial<OptionalParameters>> => {
  const { request, type, walletOrProvider } = payload;
  const parametersToOverride: Partial<OptionalParameters> = {};
  if (!request.userDeadline) {
    parametersToOverride.userDeadline = calculateDeadline(DEFAULT_DEADLINE_GAP);
  }
  if (!request.userNonce) {
    if (!walletOrProvider?.provider) {
      throw new Error(`Missing provider`);
    }

    const providerChainId = await getProviderChainId(walletOrProvider);
    if (request.chainId !== providerChainId) {
      throw new Error(
        `Request and provider chain id mismatch. Request: [${request.chainId}], provider: [${providerChainId}]`
      );
    }

    parametersToOverride.userNonce = BigNumber.from(
      (
        (await getUserNonce(
          {
            account: request.user as string,
            type,
            walletOrProvider,
          },
          config
        )) as BigNumber
      ).toNumber()
    ).toString();
  }

  return parametersToOverride;
};
