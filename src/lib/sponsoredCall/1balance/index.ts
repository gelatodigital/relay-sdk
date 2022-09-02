import { BigNumber } from "ethers";
import { getAddress } from "ethers/lib/utils";

import {
  populateOptionalSponsorParameters,
  postAuthCall,
} from "../../../utils";
import {
  AuthCall,
  PaymentType,
  RelayRequestOptions,
  RelayResponse,
} from "../../types";

import {
  SponsoredCallWith1BalanceRequest,
  SponsoredCallWith1BalanceRequestOptionalParameters,
  SponsoredCallWith1BalanceStruct,
} from "./types";

const mapRequestToStruct = async (
  request: SponsoredCallWith1BalanceRequest,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override: Partial<SponsoredCallWith1BalanceRequestOptionalParameters>
): Promise<SponsoredCallWith1BalanceStruct> => {
  return {
    chainId: BigNumber.from(request.chainId).toString(),
    target: getAddress(request.target as string),
    data: request.data,
    paymentType: PaymentType.OneBalance,
  };
};

export const sponsoredCallWith1Balance = async (
  request: SponsoredCallWith1BalanceRequest,
  sponsorApiKey: string,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  try {
    const parametersToOverride = await populateOptionalSponsorParameters<
      SponsoredCallWith1BalanceRequest,
      SponsoredCallWith1BalanceRequestOptionalParameters
    >(request);
    const struct = await mapRequestToStruct(request, parametersToOverride);

    const postResponse = await postAuthCall<
      SponsoredCallWith1BalanceStruct & RelayRequestOptions,
      RelayResponse
    >(AuthCall.Sponsor, {
      ...struct,
      ...options,
      sponsorApiKey,
    });
    return postResponse;
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/sponsoredCall/1balance: Failed with error: ${errorMessage}`
    );
  }
};
