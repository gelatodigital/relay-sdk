import { ethers } from "ethers";
import { getAddress } from "ethers/lib/utils";

import { getEIP712Domain } from "../../../../utils";
import { RelayContract } from "../../../types";
import { SignatureResponse } from "../../types";
import {
  EIP712_USER_SPONSOR_AUTH_CALL_WITH_TRANSFER_FROM_TYPE_DATA,
  UserSponsorAuthCallWithTransferFromStruct,
} from "../types";

const mapRequestToStruct = (
  request: UserSponsorAuthCallWithTransferFromStruct
): UserSponsorAuthCallWithTransferFromStruct => {
  return {
    chainId: request.chainId,
    target: getAddress(request.target as string),
    data: request.data,
    user: getAddress(request.user),
    userNonce: request.userNonce,
    userDeadline: request.userDeadline,
    sponsor: getAddress(request.sponsor as string),
    sponsorSalt: request.sponsorSalt,
    paymentType: request.paymentType,
    feeToken: getAddress(request.feeToken as string),
    maxFee: request.maxFee,
  };
};

export const generateUserSponsorSignatureWithTransferFromAndSponsor = async (
  request: UserSponsorAuthCallWithTransferFromStruct,
  signer: ethers.Wallet
): Promise<SignatureResponse> => {
  try {
    const struct = mapRequestToStruct(request);
    const domain = getEIP712Domain(
      request.chainId as number,
      RelayContract.GelatoRelayWithTransferFrom
    );
    const signature = await signer._signTypedData(
      domain,
      EIP712_USER_SPONSOR_AUTH_CALL_WITH_TRANSFER_FROM_TYPE_DATA,
      struct
    );
    return {
      signature,
      struct,
    };
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/generateUserSponsorSignature/transferFrom/sponsor: Failed with error: ${errorMessage}`
    );
  }
};
