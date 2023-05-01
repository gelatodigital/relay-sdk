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

export const populateOptionalUserParameters = async <
  Request extends CallWithERC2771Request,
  OptionalParameters extends CallWithERC2771RequestOptionalParameters
>(
  payload: {
    request: Request;
    chainId: number;
    type: ERC2771Type;
    walletOrProvider: ethers.providers.Web3Provider | ethers.Wallet;
  },
  config: Config
): Promise<Partial<OptionalParameters>> => {
  const { request, chainId, type, walletOrProvider } = payload;
  const parametersToOverride: Partial<OptionalParameters> = {};
  if (!request.userDeadline) {
    parametersToOverride.userDeadline = calculateDeadline(DEFAULT_DEADLINE_GAP);
  }
  if (!request.userNonce) {
    parametersToOverride.userNonce = BigNumber.from(
      (
        (await getUserNonce(
          {
            account: request.user as string,
            chainId,
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
