import { BigNumber, ethers } from "ethers";
import { getAddress } from "ethers/lib/utils";

import {
  getEIP712Domain,
  populateOptionalSponsorParameters,
  populateOptionalUserParameters,
  signTypedDataV4,
} from "../../../../utils";
import {
  EIP712_DOMAIN_TYPE_DATA,
  PaymentType,
  RelayContract,
} from "../../../types";
import { SignatureResponse } from "../../types";
import {
  EIP712_USER_SPONSOR_AUTH_CALL_WITH_TRANSFER_FROM_TYPE_DATA,
  UserSponsorAuthCallWithTransferFromPayloadToSign,
  UserSponsorAuthCallWithTransferFromRequest,
  UserSponsorAuthCallWithTransferFromRequestOptionalParameters,
  UserSponsorAuthCallWithTransferFromStruct,
} from "../types";

const getPayloadToSign = (
  struct: UserSponsorAuthCallWithTransferFromStruct
): UserSponsorAuthCallWithTransferFromPayloadToSign => {
  const domain = getEIP712Domain(
    struct.chainId as number,
    RelayContract.GelatoRelay
  );
  return {
    domain,
    types: {
      ...EIP712_USER_SPONSOR_AUTH_CALL_WITH_TRANSFER_FROM_TYPE_DATA,
      ...EIP712_DOMAIN_TYPE_DATA,
    },
    primaryType: "UserSponsorAuthCallWithTransferFrom",
    message: struct,
  };
};

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
    chainId: BigNumber.from(request.chainId).toString(),
    target: getAddress(request.target as string),
    data: request.data,
    user: getAddress(request.user),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    userNonce:
      override.userNonce ?? BigNumber.from(request.userNonce!).toString(),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    userDeadline:
      override.userDeadline ?? BigNumber.from(request.userDeadline!).toString(),
    sponsor: getAddress(request.sponsor as string),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    sponsorSalt:
      override.sponsorSalt ?? BigNumber.from(request.sponsorSalt!).toString(),
    paymentType: PaymentType.TransferFrom,
    feeToken: getAddress(request.feeToken as string),
    maxFee: BigNumber.from(request.maxFee).toString(),
  };
};

export const generateUserSponsorSignatureWithTransferFromAndUser = async (
  request: UserSponsorAuthCallWithTransferFromRequest,
  signer: ethers.providers.Web3Provider
): Promise<SignatureResponse> => {
  try {
    if (!signer.provider && !request.userNonce) {
      throw new Error(`No provider found to fetch the user nonce`);
    }
    const userParametersToOverride = await populateOptionalUserParameters<
      UserSponsorAuthCallWithTransferFromRequest,
      UserSponsorAuthCallWithTransferFromRequestOptionalParameters
    >(PaymentType.TransferFrom, request, signer);
    const sponsorParametersToOverride = await populateOptionalSponsorParameters<
      UserSponsorAuthCallWithTransferFromRequest,
      UserSponsorAuthCallWithTransferFromRequestOptionalParameters
    >(request);
    const struct = await mapRequestToStruct(request, {
      ...userParametersToOverride,
      ...sponsorParametersToOverride,
    });
    const signature = await signTypedDataV4(
      signer,
      request.sponsor,
      JSON.stringify(getPayloadToSign(struct))
    );
    return {
      signature,
      struct,
    };
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/generateUserSponsorSignature/transferFrom/user: Failed with error: ${errorMessage}`
    );
  }
};
