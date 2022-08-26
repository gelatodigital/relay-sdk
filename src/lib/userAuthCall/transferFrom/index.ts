import axios from "axios";
import { providers } from "ethers";
import { getAddress } from "ethers/lib/utils";

import { GELATO_RELAY_URL } from "../../../constants";
import {
  getEIP712Domain,
  signTypedDataV4,
  getHttpErrorMessage,
  populateOptionalUserParameters,
} from "../../../utils";
import {
  PaymentType,
  RelayContract,
  RelayRequestOptions,
  RelayResponse,
} from "../../types";
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
  const domain = getEIP712Domain(
    struct.chainId as number,
    RelayContract.GelatoRelayWithTransferFrom
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
    throw new Error(getHttpErrorMessage(error));
  }
};

export const userAuthCallWithTransferFrom = async (
  request: UserAuthCallWithTransferFromRequest,
  provider: providers.Web3Provider,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  try {
    const parametersToOverride = await populateOptionalUserParameters<
      UserAuthCallWithTransferFromRequest,
      UserAuthCallWithTransferFromRequestOptionalParameters
    >(PaymentType.TransferFrom, request, provider);
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
