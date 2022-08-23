import axios from "axios";
import { BigNumber, providers } from "ethers";
import { getAddress } from "ethers/lib/utils";

import {
  GELATO_RELAY_URL,
  DEFAULT_DEADLINE_GAP,
  getRelayAddress,
} from "../../../constants";
import {
  getEIP712Domain,
  calculateDeadline,
  getUserNonce,
  signTypedDataV4,
} from "../../../utils";
import { PaymentType, RelayRequestOptions, RelayResponse } from "../../types";
import { UserAuthSignature } from "../types";

import {
  EIP712_USER_AUTH_CALL_WITH_TRANSFER_FROM_TYPE_DATA,
  UserAuthCallWithTransferFromPayloadToSign,
  UserAuthCallWithTransferFromRequest,
  UserAuthCallWithTransferFromRequestOptionalParameters,
  UserAuthCallWithTransferFromStruct,
} from "./types";

const getPayloadToSign = (
  struct: UserAuthCallWithTransferFromStruct
): UserAuthCallWithTransferFromPayloadToSign => {
  const verifyingContract = getRelayAddress(struct.chainId as number);
  const domain = getEIP712Domain(
    "GelatoRelay",
    "1",
    struct.chainId as number,
    verifyingContract
  );
  return {
    domain,
    types: EIP712_USER_AUTH_CALL_WITH_TRANSFER_FROM_TYPE_DATA,
    primaryType: "UserAuthCallWithTransferFrom",
    message: struct,
  };
};

const mapRequestToStruct = (
  request: UserAuthCallWithTransferFromRequest,
  override: Partial<UserAuthCallWithTransferFromRequestOptionalParameters>
): UserAuthCallWithTransferFromStruct => {
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
    paymentType: PaymentType.TransferFrom,
    feeToken: getAddress(request.feeToken as string),
    maxFee: request.maxFee,
  };
};

const post = async (
  request: UserAuthCallWithTransferFromStruct &
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
    const errorMessage = (error as Error).message ?? String(error);

    throw new Error(
      `GelatoRelaySDK/userAuthCall/transferFrom/post: Failed with error: ${errorMessage}`
    );
  }
};

const populateOptionalParameters = async (
  request: UserAuthCallWithTransferFromRequest,
  provider: providers.Web3Provider
): Promise<Partial<UserAuthCallWithTransferFromRequestOptionalParameters>> => {
  const parametersToOverride: Partial<UserAuthCallWithTransferFromRequestOptionalParameters> =
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

export const userAuthCallWithTransferFrom = async (
  request: UserAuthCallWithTransferFromRequest,
  provider: providers.Web3Provider,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  try {
    const parametersToOverride = await populateOptionalParameters(
      request,
      provider
    );
    const struct = mapRequestToStruct(request, parametersToOverride);
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
      `GelatoRelaySDK/userAuthCall/transferFrom: Failed with error: ${errorMessage}`
    );
  }
};
