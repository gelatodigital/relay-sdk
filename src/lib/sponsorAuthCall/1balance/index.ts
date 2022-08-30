import { BigNumber, ethers } from "ethers";
import { getAddress } from "ethers/lib/utils";

import {
  getEIP712Domain,
  populateOptionalSponsorParameters,
  postAuthCall,
} from "../../../utils";
import {
  AuthCall,
  PaymentType,
  RelayContract,
  RelayRequestOptions,
  RelayResponse,
} from "../../types";
import { getFeeToken } from "../../../utils/getFeeToken";
import { SponsorAuthSignature } from "../types";

import {
  EIP712_SPONSOR_AUTH_CALL_WITH_1BALANCE_TYPE_DATA,
  SponsorAuthCallWith1BalanceRequest,
  SponsorAuthCallWith1BalanceRequestOptionalParameters,
  SponsorAuthCallWith1BalanceStruct,
} from "./types";

const mapRequestToStruct = async (
  request: SponsorAuthCallWith1BalanceRequest,
  override: Partial<SponsorAuthCallWith1BalanceRequestOptionalParameters>
): Promise<SponsorAuthCallWith1BalanceStruct> => {
  return {
    chainId: BigNumber.from(request.chainId).toString(),
    target: getAddress(request.target as string),
    data: request.data,
    sponsor: getAddress(request.sponsor as string),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    sponsorSalt:
      override.sponsorSalt ?? BigNumber.from(request.sponsorSalt!).toString(),
    paymentType: PaymentType.OneBalance,
    feeToken: getAddress(
      await getFeeToken(request.chainId as number, request.sponsor as string)
    ),
    oneBalanceChainId: BigNumber.from(request.oneBalanceChainId).toString(),
  };
};

export const sponsorAuthCallWith1Balance = async (
  request: SponsorAuthCallWith1BalanceRequest,
  signer: ethers.Wallet,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  try {
    const parametersToOverride = await populateOptionalSponsorParameters<
      SponsorAuthCallWith1BalanceRequest,
      SponsorAuthCallWith1BalanceRequestOptionalParameters
    >(request);
    const struct = await mapRequestToStruct(request, parametersToOverride);
    const domain = getEIP712Domain(
      request.chainId as number,
      RelayContract.GelatoRelay
    );
    const signature = await signer._signTypedData(
      domain,
      EIP712_SPONSOR_AUTH_CALL_WITH_1BALANCE_TYPE_DATA,
      struct
    );
    const postResponse = await postAuthCall<
      SponsorAuthCallWith1BalanceStruct &
        RelayRequestOptions &
        SponsorAuthSignature,
      RelayResponse
    >(AuthCall.Sponsor, {
      ...struct,
      ...options,
      sponsorSignature: signature,
    });
    return postResponse;
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/generateSponsorSignature/1balance: Failed with error: ${errorMessage}`
    );
  }
};
