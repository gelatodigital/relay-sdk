import { BigNumber, utils } from "ethers";

import {
  SponsorAuthCallWith1BalanceRequest,
  SponsorAuthCallWith1BalanceRequestOptionalParameters,
} from "../lib/sponsorAuthCall/1balance/types";
import {
  SponsorAuthCallWithTransferFromRequest,
  SponsorAuthCallWithTransferFromRequestOptionalParameters,
} from "../lib/sponsorAuthCall/transferFrom/types";
import {
  UserSponsorAuthCallWith1BalanceRequest,
  UserSponsorAuthCallWith1BalanceRequestOptionalParameters,
} from "../lib/userSponsorAuthCall/1balance/types";
import {
  UserSponsorAuthCallWithTransferFromRequest,
  UserSponsorAuthCallWithTransferFromRequestOptionalParameters,
} from "../lib/userSponsorAuthCall/transferFrom/types";

export const populateOptionalSponsorParameters = async <
  Request extends
    | SponsorAuthCallWith1BalanceRequest
    | SponsorAuthCallWithTransferFromRequest
    | UserSponsorAuthCallWith1BalanceRequest
    | UserSponsorAuthCallWithTransferFromRequest,
  OptionalParameters extends
    | SponsorAuthCallWith1BalanceRequestOptionalParameters
    | SponsorAuthCallWithTransferFromRequestOptionalParameters
    | UserSponsorAuthCallWith1BalanceRequestOptionalParameters
    | UserSponsorAuthCallWithTransferFromRequestOptionalParameters
>(
  request: Request
): Promise<Partial<OptionalParameters>> => {
  const parametersToOverride: Partial<OptionalParameters> = {};
  if (!request.sponsorSalt) {
    parametersToOverride.sponsorSalt = BigNumber.from(
      utils.randomBytes(32)
    ).toString();
  }
  return parametersToOverride;
};
