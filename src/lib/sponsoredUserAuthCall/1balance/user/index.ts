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
import {
  EIP712_SPONSORED_USER_AUTH_CALL,
  SponsoredUserAuthCallPayloadToSign,
  SponsoredUserAuthCallRequest,
  SponsoredUserAuthCallRequestOptionalParameters,
  SponsoredUserAuthCallStruct,
} from "../types";
import { SignatureResponse } from "../../types";

const getPayloadToSign = (
  struct: SponsoredUserAuthCallStruct
): SponsoredUserAuthCallPayloadToSign => {
  const domain = getEIP712Domain(
    struct.chainId as number,
    RelayContract.GelatoRelay
  );
  return {
    domain,
    types: {
      ...EIP712_SPONSORED_USER_AUTH_CALL,
      ...EIP712_DOMAIN_TYPE_DATA,
    },
    primaryType: "SponsoredUserAuthCall",
    message: struct,
  };
};

const mapRequestToStruct = async (
  request: SponsoredUserAuthCallRequest,
  override: Partial<SponsoredUserAuthCallRequestOptionalParameters>
): Promise<SponsoredUserAuthCallStruct> => {
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
    userNonce:
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      override.userNonce ?? BigNumber.from(request.userNonce!).toString(),
    userDeadline:
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      override.userDeadline ?? BigNumber.from(request.userDeadline!).toString(),
    paymentType: PaymentType.OneBalance,
  };
};

export const generateUserSponsorSignatureWith1BalanceAndUser = async (
  request: SponsoredUserAuthCallRequest,
  signer: ethers.providers.Web3Provider
): Promise<SignatureResponse> => {
  try {
    if (!signer.provider && !request.userNonce) {
      throw new Error(`No provider found to fetch the user nonce`);
    }
    const userParametersToOverride = await populateOptionalUserParameters<
      SponsoredUserAuthCallRequest,
      SponsoredUserAuthCallRequestOptionalParameters
    >(PaymentType.OneBalance, request, signer);
    const sponsorParametersToOverride = await populateOptionalSponsorParameters<
      SponsoredUserAuthCallRequest,
      SponsoredUserAuthCallRequestOptionalParameters
    >(request);
    const struct = await mapRequestToStruct(request, {
      ...userParametersToOverride,
      ...sponsorParametersToOverride,
    });
    const signature = await signTypedDataV4(
      signer,
      request.user,
      JSON.stringify(getPayloadToSign(struct))
    );
    return {
      signature,
      struct,
    };
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/generateUserSponsorSignature/1balance/user: Failed with error: ${errorMessage}`
    );
  }
};
