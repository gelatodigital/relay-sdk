import { BigNumber, providers } from "ethers";

import { DEFAULT_DEADLINE_GAP } from "../../../constants";
import {
  UserAuthCallWith1BalanceRequest,
  UserAuthCallWith1BalanceRequestOptionalParameters,
} from "../1balance/types";
import {
  UserAuthCallWithTransferFromRequest,
  UserAuthCallWithTransferFromRequestOptionalParameters,
} from "../transferFrom/types";
import { calculateDeadline } from "../../../utils/calculateDeadline";
import { getUserNonce } from "../../../utils/getUserNonce";

export const populateOptionalUserParameters = async <
  Request extends
    | UserAuthCallWith1BalanceRequest
    | UserAuthCallWithTransferFromRequest,
  OptionalParameters extends
    | UserAuthCallWith1BalanceRequestOptionalParameters
    | UserAuthCallWithTransferFromRequestOptionalParameters
>(
  request: Request,
  provider: providers.Web3Provider
): Promise<Partial<OptionalParameters>> => {
  const parametersToOverride: Partial<OptionalParameters> = {};
  if (!request.userDeadline) {
    parametersToOverride.userDeadline = calculateDeadline(DEFAULT_DEADLINE_GAP);
  }
  if (!request.userNonce) {
    parametersToOverride.userNonce = (
      (await getUserNonce(
        request.chainId as number,
        request.user as string,
        provider
      )) as BigNumber
    ).toNumber();
  }

  return parametersToOverride;
};
