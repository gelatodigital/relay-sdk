import { ethers } from "ethers";
import { getAddress } from "ethers/lib/utils";

import {
  getEIP712Domain,
  populateOptionalUserParameters,
} from "../../../utils";
import { PaymentType, RelayContract } from "../../types";

import {
  EIP712_USER_SPONSOR_AUTH_CALL_WITH_TRANSFER_FROM_TYPE_DATA,
  UserSponsorAuthCallWithTransferFromRequest,
  UserSponsorAuthCallWithTransferFromRequestOptionalParameters,
  UserSponsorAuthCallWithTransferFromStruct,
} from "./types";

const mapRequestToStruct = async (
  request: UserSponsorAuthCallWithTransferFromRequest,
  override: Partial<UserSponsorAuthCallWithTransferFromRequestOptionalParameters>
): Promise<UserSponsorAuthCallWithTransferFromStruct> => {
  if (!override.userNonce && !request.userNonce) {
    throw new Error(`userNonce is not found in the request, nor fetched`);
  }
  if (!override.userDeadline && !request.userDeadline) {
    throw new Error(`userDeadline is not found in the request, nor fetched`);
  }
  return {
    chainId: request.chainId,
    target: getAddress(request.target as string),
    data: request.data,
    user: getAddress(request.user),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    userNonce: override.userNonce ?? request.userNonce!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    userDeadline: override.userDeadline ?? request.userDeadline!,
    sponsor: getAddress(request.sponsor as string),
    sponsorSalt: request.sponsorSalt,
    paymentType: PaymentType.TransferFrom,
    feeToken: getAddress(request.feeToken as string),
    maxFee: request.maxFee,
  };
};

export const generateUserSponsorSignatureWithTransferFrom = async (
  request: UserSponsorAuthCallWithTransferFromRequest,
  signer: ethers.Wallet
): Promise<string> => {
  try {
    if (!signer.provider && !request.userNonce) {
      throw new Error(`No provider found to fetch the user nonce`);
    }
    const parametersToOverride = await populateOptionalUserParameters<
      UserSponsorAuthCallWithTransferFromRequest,
      UserSponsorAuthCallWithTransferFromRequestOptionalParameters
    >(PaymentType.TransferFrom, request, signer.provider);
    const struct = await mapRequestToStruct(request, parametersToOverride);
    const domain = getEIP712Domain(
      request.chainId as number,
      RelayContract.GelatoRelayWithTransferFrom
    );
    return await signer._signTypedData(
      domain,
      EIP712_USER_SPONSOR_AUTH_CALL_WITH_TRANSFER_FROM_TYPE_DATA,
      struct
    );
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/generateUserSponsorSignature/transferFrom: Failed with error: ${errorMessage}`
    );
  }
};
