import axios from "axios";
import { BigNumber, providers } from "ethers";
import { getAddress } from "ethers/lib/utils";
import { GELATO_RELAY_URL } from "../../../../constants";
import { getEIP712Domain } from "../../../../utils";
import { DEFAULT_DEADLINE_GAP, getRelayAddress } from "../../constants";
import { PaymentType, RelayRequestOptions, RelayResponse } from "../../types";
import { calculateDeadline, getUserNonce, signTypedDataV4 } from "../../utils";
import { UserAuthSignature } from "../types";
import {
  EIP712UserAuthCallWithTransferFromTypeData,
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
    types: EIP712UserAuthCallWithTransferFromTypeData,
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
    userNonce: override.userNonce ?? request.userNonce!,
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
): Promise<any> => {
  try {
    const response = await axios.post(
      `${GELATO_RELAY_URL}/v2/relays/user-auth-call`,
      request
    );
    return response.data;
  } catch (error) {
    const errorMsg = (error as Error).message ?? String(error);

    throw new Error(
      `GelatoRelaySDK/userAuthCall/transferFrom/post: Failed with error: ${errorMsg}`
    );
  }
};

const populateOptionalParameters = async (
  request: UserAuthCallWithTransferFromRequest,
  provider: providers.Web3Provider
): Promise<Partial<UserAuthCallWithTransferFromRequestOptionalParameters>> => {
  const paramsToOverride: Partial<UserAuthCallWithTransferFromRequestOptionalParameters> =
    {};
  if (!request.userDeadline) {
    paramsToOverride.userDeadline = calculateDeadline(DEFAULT_DEADLINE_GAP);
  }
  if (!request.userNonce) {
    paramsToOverride.userNonce = (
      (await getUserNonce(
        request.chainId as number,
        request.user as string,
        provider
      )) as BigNumber
    ).toNumber();
  }

  return paramsToOverride;
};

export const userAuthCallWithTransferFrom = async (
  request: UserAuthCallWithTransferFromRequest,
  provider: providers.Web3Provider,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  try {
    const paramsToOverride = await populateOptionalParameters(
      request,
      provider
    );
    const struct = mapRequestToStruct(request, paramsToOverride);
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
    throw Error(
      `GelatoRelaySDK/userAuthCall/transferFrom: Failed with error: ${errorMessage}`
    );
  }
};
