import { BigNumber } from "ethers";
import { getAddress } from "ethers/lib/utils";

import { postAuthCall } from "../../../utils";
import {
  RelayCall,
  PaymentType,
  RelayRequestOptions,
  RelayResponse,
  ApiKey,
  OneBalancePaymentType,
} from "../../types";
import { SponsoredCallRequest, SponsoredCallStruct } from "../types";

const mapRequestToStruct = async (
  request: SponsoredCallRequest
): Promise<SponsoredCallStruct> => {
  return {
    chainId: BigNumber.from(request.chainId).toString(),
    target: getAddress(request.target as string),
    data: request.data,
  };
};

export const sponsoredCallWith1Balance = async (
  request: SponsoredCallRequest,
  sponsorApiKey: string,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  try {
    const struct = await mapRequestToStruct(request);
    const postResponse = await postAuthCall<
      SponsoredCallStruct &
        RelayRequestOptions &
        ApiKey &
        OneBalancePaymentType,
      RelayResponse
    >(RelayCall.Sponsored, {
      ...struct,
      ...options,
      sponsorApiKey,
      paymentType: PaymentType.OneBalance,
    });
    return postResponse;
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/sponsoredCall/1balance: Failed with error: ${errorMessage}`
    );
  }
};
