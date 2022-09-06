import { BigNumber, providers } from "ethers";
import { getAddress } from "ethers/lib/utils";

import {
  getEIP712Domain,
  signTypedDataV4,
  populateOptionalUserParameters,
  postAuthCall,
} from "../../../utils";
import {
  RelayCall,
  EIP712_DOMAIN_TYPE_DATA,
  PaymentType,
  RelayContract,
  RelayRequestOptions,
  RelayResponse,
  ApiKey,
  OneBalancePaymentType,
} from "../../types";
import {
  EIP712_SPONSORED_USER_AUTH_CALL_TYPE_DATA,
  SponsoredUserAuthCallPayloadToSign,
  SponsoredUserAuthCallRequest,
  SponsoredUserAuthCallRequestOptionalParameters,
  SponsoredUserAuthCallStruct,
  UserAuthSignature,
} from "../types";

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
      ...EIP712_SPONSORED_USER_AUTH_CALL_TYPE_DATA,
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
    userNonce:
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      override.userNonce ?? BigNumber.from(request.userNonce!).toString(),
    userDeadline:
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      override.userDeadline ?? BigNumber.from(request.userDeadline!).toString(),
    chainId: BigNumber.from(request.chainId).toString(),
    target: getAddress(request.target as string),
    data: request.data,
    user: getAddress(request.user as string),
  };
};

export const sponsoredUserAuthCallWith1Balance = async (
  request: SponsoredUserAuthCallRequest,
  provider: providers.Web3Provider,
  sponsorApiKey: string,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  try {
    const parametersToOverride = await populateOptionalUserParameters<
      SponsoredUserAuthCallRequest,
      SponsoredUserAuthCallRequestOptionalParameters
    >(PaymentType.OneBalance, request, provider);
    const struct = await mapRequestToStruct(request, parametersToOverride);
    const signature = await signTypedDataV4(
      provider,
      request.user as string,
      JSON.stringify(getPayloadToSign(struct))
    );
    const postResponse = await postAuthCall<
      SponsoredUserAuthCallStruct &
        RelayRequestOptions &
        UserAuthSignature &
        OneBalancePaymentType &
        ApiKey,
      RelayResponse
    >(RelayCall.SponsoredUserAuth, {
      ...struct,
      ...options,
      userSignature: signature,
      sponsorApiKey,
      paymentType: PaymentType.OneBalance,
    });
    return postResponse;
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/sponsoredUserAuthCall/1balance: Failed with error: ${errorMessage}`
    );
  }
};
