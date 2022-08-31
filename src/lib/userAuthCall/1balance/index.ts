import { BigNumber, providers } from "ethers";
import { getAddress } from "ethers/lib/utils";

import {
  getEIP712Domain,
  signTypedDataV4,
  getFeeToken,
  populateOptionalUserParameters,
  postAuthCall,
} from "../../../utils";
import {
  AuthCall,
  EIP712_DOMAIN_TYPE_DATA,
  PaymentType,
  RelayContract,
  RelayRequestOptions,
  RelayResponse,
} from "../../types";
import { UserAuthSignature } from "../types";

import {
  EIP712_USER_AUTH_CALL_WITH_1BALANCE_TYPE_DATA,
  UserAuthCallWith1BalancePayloadToSign,
  UserAuthCallWith1BalanceRequest,
  UserAuthCallWith1BalanceRequestOptionalParameters,
  UserAuthCallWith1BalanceStruct,
} from "./types";

const getPayloadToSign = (
  struct: UserAuthCallWith1BalanceStruct
): UserAuthCallWith1BalancePayloadToSign => {
  const domain = getEIP712Domain(
    struct.chainId as number,
    RelayContract.GelatoRelay
  );
  return {
    domain,
    types: {
      ...EIP712_USER_AUTH_CALL_WITH_1BALANCE_TYPE_DATA,
      ...EIP712_DOMAIN_TYPE_DATA,
    },
    primaryType: "UserAuthCallWith1Balance",
    message: struct,
  };
};

const mapRequestToStruct = async (
  request: UserAuthCallWith1BalanceRequest,
  override: Partial<UserAuthCallWith1BalanceRequestOptionalParameters>
): Promise<UserAuthCallWith1BalanceStruct> => {
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
    paymentType: PaymentType.OneBalance,
    feeToken: getAddress(
      await getFeeToken(request.chainId as number, request.user as string)
    ),
    oneBalanceChainId: BigNumber.from(request.oneBalanceChainId).toString(),
  };
};

export const userAuthCallWith1Balance = async (
  request: UserAuthCallWith1BalanceRequest,
  provider: providers.Web3Provider,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  try {
    const parametersToOverride = await populateOptionalUserParameters<
      UserAuthCallWith1BalanceRequest,
      UserAuthCallWith1BalanceRequestOptionalParameters
    >(PaymentType.OneBalance, request, provider);
    const struct = await mapRequestToStruct(request, parametersToOverride);
    const signature = await signTypedDataV4(
      provider,
      request.user as string,
      JSON.stringify(getPayloadToSign(struct))
    );
    const postResponse = await postAuthCall<
      UserAuthCallWith1BalanceStruct & RelayRequestOptions & UserAuthSignature,
      RelayResponse
    >(AuthCall.User, {
      ...struct,
      ...options,
      userSignature: signature,
    });
    return postResponse;
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/userAuthCall/1balance: Failed with error: ${errorMessage}`
    );
  }
};
