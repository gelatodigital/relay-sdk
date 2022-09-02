import { BigNumber, ethers } from "ethers";
import { getAddress } from "ethers/lib/utils";

import { getEIP712Domain } from "../../../../utils";
import { RelayContract } from "../../../types";
import {
  EIP712_SPONSORED_USER_AUTH_CALL,
  SponsoredUserAuthCallStruct,
} from "../types";
import { SignatureResponse } from "../../types";

const mapRequestToStruct = (
  request: SponsoredUserAuthCallStruct
): SponsoredUserAuthCallStruct => {
  return {
    chainId: BigNumber.from(request.chainId).toString(),
    target: getAddress(request.target as string),
    data: request.data,
    user: getAddress(request.user),
    userNonce: BigNumber.from(request.userNonce).toString(),
    userDeadline: BigNumber.from(request.userDeadline).toString(),
    paymentType: request.paymentType,
  };
};

export const generateUserSponsorSignatureWith1BalanceAndSponsor = async (
  request: SponsoredUserAuthCallStruct,
  signer: ethers.Wallet
): Promise<SignatureResponse> => {
  try {
    const struct = mapRequestToStruct(request);
    const domain = getEIP712Domain(
      request.chainId as number,
      RelayContract.GelatoRelay
    );
    const signature = await signer._signTypedData(
      domain,
      EIP712_SPONSORED_USER_AUTH_CALL,
      struct
    );
    return {
      signature,
      struct,
    };
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/generateUserSponsorSignature/1balance/sponsor: Failed with error: ${errorMessage}`
    );
  }
};
