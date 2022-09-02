import { BigNumber, utils } from "ethers";

import {
  SponsorAuthCallWith1BalanceRequest,
  SponsorAuthCallWith1BalanceRequestOptionalParameters,
} from "../lib/sponsorAuthCall/1balance/types";
import {
  UserSponsorAuthCallWith1BalanceRequest,
  UserSponsorAuthCallWith1BalanceRequestOptionalParameters,
} from "../lib/userSponsorAuthCall/1balance/types";

export const populateOptionalSponsorParameters = async <
  Request extends
    | SponsorAuthCallWith1BalanceRequest
    | UserSponsorAuthCallWith1BalanceRequest,
  OptionalParameters extends
    | SponsorAuthCallWith1BalanceRequestOptionalParameters
    | UserSponsorAuthCallWith1BalanceRequestOptionalParameters
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
