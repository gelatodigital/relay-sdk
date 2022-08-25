import axios from "axios";
import { providers } from "ethers";
import { getAddress } from "ethers/lib/utils";

import { GELATO_RELAY_URL } from "../../../constants";
import {
  getEIP712Domain,
  signTypedDataV4,
  getHttpErrorMessage,
} from "../../../utils";
import {
  PaymentType,
  RelayContract,
  RelayRequestOptions,
  RelayResponse,
} from "../../types";
import { getFeeToken } from "../../../utils/getFeeToken";
import { UserAuthSignature } from "../types";
import { populateOptionalUserParameters } from "../utils";

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
    feeToken: getAddress(
      await getFeeToken(request.chainId as number, request.user as string)
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
    throw new Error(getHttpErrorMessage(error));
  }
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
    >(request, provider);
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
