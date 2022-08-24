import axios from "axios";
import { BigNumber, providers } from "ethers";
import { getAddress } from "ethers/lib/utils";

import {
  GELATO_RELAY_URL,
  DEFAULT_DEADLINE_GAP,
  getRelayAddress,
  DEFAULT_INTERNAL_ERROR_MESSAGE,
} from "../../../constants";
import {
  getEIP712Domain,
  calculateDeadline,
  getUserNonce,
  signTypedDataV4,
} from "../../../utils";
import { PaymentType, RelayRequestOptions, RelayResponse } from "../../types";
import { getFeeToken } from "../../../utils/getFeeToken";
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
  const verifyingContract = getRelayAddress(struct.chainId as number);
  const domain = getEIP712Domain(
    "GelatoRelay",
    "1",
    struct.chainId as number,
    verifyingContract
  );
  return {
    domain,
    types: EIP712_USER_AUTH_CALL_WITH_1BALANCE_TYPE_DATA,
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    userNonce: override.userNonce ?? request.userNonce!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    userDeadline: override.userDeadline ?? request.userDeadline!,
    chainId: request.chainId,
    target: getAddress(request.target as string),
    data: request.data,
    user: getAddress(request.user as string),
    paymentType: PaymentType.OneBalance,
    feeToken: await getFeeToken(
      request.chainId as number,
      request.user as string
    ),
    oneBalanceChainId: request.oneBalanceChainId,
  };
};

const post = async (
  request: UserAuthCallWith1BalanceStruct &
    RelayRequestOptions &
    UserAuthSignature
): Promise<RelayResponse> => {
  try {
    const response = await axios.post(
      `${GELATO_RELAY_URL}/relays/v2/user-auth-call`,
      request
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ??
      error.message ??
      DEFAULT_INTERNAL_ERROR_MESSAGE;
    throw new Error(errorMessage);
  }
};

const populateOptionalParameters = async (
  request: UserAuthCallWith1BalanceRequest,
  provider: providers.Web3Provider
): Promise<Partial<UserAuthCallWith1BalanceRequestOptionalParameters>> => {
  const parametersToOverride: Partial<UserAuthCallWith1BalanceRequestOptionalParameters> =
    {};
  if (!request.userDeadline) {
    parametersToOverride.userDeadline = calculateDeadline(DEFAULT_DEADLINE_GAP);
  }
  if (!request.userNonce) {
    parametersToOverride.userNonce = (
      (await getUserNonce(
        request.chainId as number,
        request.user as string,
        provider
      )) as BigNumber
    ).toNumber();
  }

  return parametersToOverride;
};

export const userAuthCallWith1Balance = async (
  request: UserAuthCallWith1BalanceRequest,
  provider: providers.Web3Provider,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  try {
    const parametersToOverride = await populateOptionalParameters(
      request,
      provider
    );
    const struct = await mapRequestToStruct(request, parametersToOverride);
    const signature = await signTypedDataV4(
      provider,
      request.user as string,
      JSON.stringify(getPayloadToSign(struct))
    );
    const postResponse = await post({
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
