import { BigNumber, ethers, providers } from "ethers";

import { DEFAULT_DEADLINE_GAP } from "../constants";
import { PaymentType } from "../lib";
import {
  UserAuthCallWith1BalanceRequest,
  UserAuthCallWith1BalanceRequestOptionalParameters,
} from "../lib/userAuthCall/1balance/types";
import {
  UserAuthCallWithTransferFromRequest,
  UserAuthCallWithTransferFromRequestOptionalParameters,
} from "../lib/userAuthCall/transferFrom/types";
import {
  UserSponsorAuthCallWith1BalanceRequest,
  UserSponsorAuthCallWith1BalanceRequestOptionalParameters,
} from "../lib/userSponsorAuthCall/1balance/types";
import {
  UserSponsorAuthCallWithTransferFromRequest,
  UserSponsorAuthCallWithTransferFromRequestOptionalParameters,
} from "../lib/userSponsorAuthCall/transferFrom/types";

import { calculateDeadline } from "./calculateDeadline";
import { getUserNonce } from "./getUserNonce";

export const populateOptionalUserParameters = async <
  Request extends
    | UserAuthCallWith1BalanceRequest
    | UserAuthCallWithTransferFromRequest
    | UserSponsorAuthCallWith1BalanceRequest
    | UserSponsorAuthCallWithTransferFromRequest,
  OptionalParameters extends
    | UserAuthCallWith1BalanceRequestOptionalParameters
    | UserAuthCallWithTransferFromRequestOptionalParameters
    | UserSponsorAuthCallWith1BalanceRequestOptionalParameters
    | UserSponsorAuthCallWithTransferFromRequestOptionalParameters
>(
  paymentType: PaymentType,
  request: Request,
  provider: providers.Web3Provider | ethers.providers.Provider
): Promise<Partial<OptionalParameters>> => {
  const parametersToOverride: Partial<OptionalParameters> = {};
  if (!request.userDeadline) {
    parametersToOverride.userDeadline = calculateDeadline(DEFAULT_DEADLINE_GAP);
  }
  if (!request.userNonce) {
    parametersToOverride.userNonce = (
      (await getUserNonce(
        paymentType,
        request.chainId as number,
        request.user as string,
        provider
      )) as BigNumber
    ).toNumber();
  }

  return parametersToOverride;
};
