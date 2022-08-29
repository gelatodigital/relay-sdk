import { ethers } from "ethers";
import { getAddress } from "ethers/lib/utils";

import { getEIP712Domain, postAuthCall } from "../../../utils";
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
  SponsorAuthCallWithTransferFromStruct,
} from "./types";

const mapRequestToStruct = async (
  request: SponsorAuthCallWithTransferFromRequest
): Promise<SponsorAuthCallWithTransferFromStruct> => {
  return {
    chainId: request.chainId,
    target: getAddress(request.target as string),
    data: request.data,
    sponsor: getAddress(request.sponsor as string),
    sponsorSalt: request.sponsorSalt,
    paymentType: PaymentType.TransferFrom,
    feeToken: getAddress(request.feeToken as string),
    maxFee: request.maxFee,
  };
};

export const sponsorAuthCallWithTransferFrom = async (
  request: SponsorAuthCallWithTransferFromRequest,
  signer: ethers.Wallet,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  try {
    const struct = await mapRequestToStruct(request);
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
