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
import { SponsorAuthSignature } from "../types";

import {
  EIP712_SPONSOR_AUTH_CALL_WITH_TRANSFER_FROM_TYPE_DATA,
  SponsorAuthCallWithTransferFromRequest,
  SponsorAuthCallWithTransferFromRequestOptionalParameters,
  SponsorAuthCallWithTransferFromStruct,
} from "./types";

const mapRequestToStruct = async (
  request: SponsorAuthCallWithTransferFromRequest,
  override: Partial<SponsorAuthCallWithTransferFromRequestOptionalParameters>
): Promise<SponsorAuthCallWithTransferFromStruct> => {
  return {
    chainId: BigNumber.from(request.chainId).toString(),
    target: getAddress(request.target as string),
    data: request.data,
    sponsor: getAddress(request.sponsor as string),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    sponsorSalt:
      override.sponsorSalt ?? BigNumber.from(request.sponsorSalt!).toString(),
    paymentType: PaymentType.TransferFrom,
    feeToken: getAddress(request.feeToken as string),
    maxFee: BigNumber.from(request.maxFee).toString(),
  };
};

export const sponsorAuthCallWithTransferFrom = async (
  request: SponsorAuthCallWithTransferFromRequest,
  signer: ethers.Wallet,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  try {
    const parametersToOverride = await populateOptionalSponsorParameters<
      SponsorAuthCallWithTransferFromRequest,
      SponsorAuthCallWithTransferFromRequestOptionalParameters
    >(request);
    const struct = await mapRequestToStruct(request, parametersToOverride);
    const domain = getEIP712Domain(
      request.chainId as number,
      RelayContract.GelatoRelayWithTransferFrom
    );
    const signature = await signer._signTypedData(
      domain,
      EIP712_SPONSOR_AUTH_CALL_WITH_TRANSFER_FROM_TYPE_DATA,
      struct
    );
    const postResponse = await postAuthCall<
      SponsorAuthCallWithTransferFromStruct &
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
      `GelatoRelaySDK/generateSponsorSignature/transferFrom: Failed with error: ${errorMessage}`
    );
  }
};
