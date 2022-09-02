import {
  SponsoredCallWith1BalanceRequest,
  SponsoredCallWith1BalanceRequestOptionalParameters,
} from "../lib/sponsoredCall/1balance/types";
import {
  SponsoredUserAuthCallRequest,
  SponsoredUserAuthCallRequestOptionalParameters,
} from "../lib/sponsoredUserAuthCall/1balance/types";

export const populateOptionalSponsorParameters = async <
  Request extends
    | SponsoredCallWith1BalanceRequest
    | SponsoredUserAuthCallRequest,
  OptionalParameters extends
    | SponsoredCallWith1BalanceRequestOptionalParameters
    | SponsoredUserAuthCallRequestOptionalParameters
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  request: Request
): Promise<Partial<OptionalParameters>> => {
  const parametersToOverride: Partial<OptionalParameters> = {};
  return parametersToOverride;
};
