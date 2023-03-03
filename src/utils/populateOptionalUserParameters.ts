import { BigNumber, ethers } from "ethers";

import { DEFAULT_DEADLINE_GAP } from "../constants";
import {
  CallWithERC2771Request,
  CallWithERC2771RequestOptionalParameters,
} from "../lib/erc2771/types";

import { calculateDeadline } from "./calculateDeadline";
import { getUserNonce } from "./getUserNonce";

export const populateOptionalUserParameters = async <
  Request extends CallWithERC2771Request,
  OptionalParameters extends CallWithERC2771RequestOptionalParameters
>(
  request: Request,
  walletOrProvider: ethers.providers.Web3Provider | ethers.Wallet
): Promise<Partial<OptionalParameters>> => {
  const parametersToOverride: Partial<OptionalParameters> = {};
  if (!request.userDeadline) {
    parametersToOverride.userDeadline = calculateDeadline(DEFAULT_DEADLINE_GAP);
  }
  if (!request.userNonce) {
    parametersToOverride.userNonce = BigNumber.from(
      (
        (await getUserNonce(
          request.user as string,
          walletOrProvider
        )) as BigNumber
      ).toNumber()
    ).toString();
  }

  return parametersToOverride;
};
