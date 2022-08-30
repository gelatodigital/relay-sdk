import { BigNumber, ethers } from "ethers";
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
    chainId: BigNumber.from(request.chainId).toString(),
    target: getAddress(request.target as string),
    data: request.data,
    user: getAddress(request.user),
    userNonce: BigNumber.from(request.userNonce).toString(),
    userDeadline: BigNumber.from(request.userDeadline).toString(),
    sponsor: getAddress(request.sponsor as string),
    sponsorSalt: BigNumber.from(request.sponsorSalt).toString(),
    paymentType: request.paymentType,
    feeToken: getAddress(request.feeToken as string),
    maxFee: BigNumber.from(request.maxFee).toString(),
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
