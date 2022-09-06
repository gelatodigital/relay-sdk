import { BigNumber, ethers, providers } from "ethers";

import { DEFAULT_DEADLINE_GAP } from "../constants";
import {
  SponsoredUserAuthCallRequest,
  SponsoredUserAuthCallRequestOptionalParameters,
} from "../lib/sponsoredUserAuthCall/types";
import { PaymentType } from "../lib/types";

import { calculateDeadline } from "./calculateDeadline";
import { getUserNonce } from "./getUserNonce";

export const populateOptionalUserParameters = async <
  Request extends SponsoredUserAuthCallRequest,
  OptionalParameters extends SponsoredUserAuthCallRequestOptionalParameters
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
    parametersToOverride.userNonce = BigNumber.from(
      (
        (await getUserNonce(
          paymentType,
          request.chainId as number,
          request.user as string,
          provider
        )) as BigNumber
      ).toNumber()
    ).toString();
  }

  return parametersToOverride;
};
