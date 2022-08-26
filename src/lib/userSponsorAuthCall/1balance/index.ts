import { ethers } from "ethers";
import { getAddress } from "ethers/lib/utils";

import {
  getEIP712Domain,
  populateOptionalUserParameters,
} from "../../../utils";
import { PaymentType, RelayContract } from "../../types";
import { getFeeToken } from "../../../utils/getFeeToken";

import {
  EIP712_USER_SPONSOR_AUTH_CALL_WITH_1BALANCE_TYPE_DATA,
  UserSponsorAuthCallWith1BalanceRequest,
  UserSponsorAuthCallWith1BalanceRequestOptionalParameters,
  UserSponsorAuthCallWith1BalanceStruct,
} from "./types";

const mapRequestToStruct = async (
  request: UserSponsorAuthCallWith1BalanceRequest,
  override: Partial<UserSponsorAuthCallWith1BalanceRequestOptionalParameters>
): Promise<UserSponsorAuthCallWith1BalanceStruct> => {
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
    paymentType: PaymentType.OneBalance,
    feeToken: getAddress(
      await getFeeToken(request.chainId as number, request.sponsor as string)
    ),
    oneBalanceChainId: request.oneBalanceChainId,
  };
};

export const generateUserSponsorSignatureWith1Balance = async (
  request: UserSponsorAuthCallWith1BalanceRequest,
  signer: ethers.Wallet
): Promise<string> => {
  try {
    if (!signer.provider && !request.userNonce) {
      throw new Error(`No provider found to fetch the user nonce`);
    }
    const parametersToOverride = await populateOptionalUserParameters<
      UserSponsorAuthCallWith1BalanceRequest,
      UserSponsorAuthCallWith1BalanceRequestOptionalParameters
    >(PaymentType.OneBalance, request, signer.provider);
    const struct = await mapRequestToStruct(request, parametersToOverride);
    const domain = getEIP712Domain(
      request.chainId as number,
      RelayContract.GelatoRelay
    );
    return await signer._signTypedData(
      domain,
      EIP712_USER_SPONSOR_AUTH_CALL_WITH_1BALANCE_TYPE_DATA,
      struct
    );
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/generateUserSponsorSignature/1balance: Failed with error: ${errorMessage}`
    );
  }
};
