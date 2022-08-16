import axios from "axios";
import { providers } from "ethers";
import { GELATO_RELAY_URL } from "../../../../constants";
import { getEIP712Domain } from "../../../../utils";
import { getRelayAddress } from "../../constants";
import { PaymentType, RelayRequestOptions } from "../../types";
import { signTypedDataV4 } from "../../utils";
import { UserAuthCallPayloadToSign, UserAuthSignature } from "../types";
import {
  EIP712UserAuthCallWithTransferFromTypeData,
  UserAuthCallWithTransferFromRequest,
  UserAuthCallWithTransferFromStruct,
} from "./types";

const getPayloadToSign = (
  struct: UserAuthCallWithTransferFromStruct
): UserAuthCallPayloadToSign<UserAuthCallWithTransferFromStruct> => {
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
    primaryType: "UserAuthCall",
    message: struct,
  };
};

const mapRequestToStruct = (
  request: UserAuthCallWithTransferFromRequest
): UserAuthCallWithTransferFromStruct => {
  return {
    chainId: request.chainId,
    target: request.target,
    data: request.data,
    user: request.user,
    userNonce: request.userNonce,
    userDeadline: request.userDeadline ?? 0,
    paymentType: PaymentType.TransferFrom,
    feeToken: request.feeToken,
    maxFee: request.maxFee,
  }
};

const post = async (
  request: UserAuthCallWithTransferFromStruct &
    RelayRequestOptions &
    UserAuthSignature
): Promise<any> => {
  try {
    const response = await axios.post(
      `${GELATO_RELAY_URL}/v2/relays/userAuthCall`,
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

export const userAuthCallWithTransferFrom = async (
  request: UserAuthCallWithTransferFromRequest,
  provider: providers.Web3Provider,
  options?: RelayRequestOptions
): Promise<string> => {
  try {
    const struct = mapRequestToStruct(request);
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
    throw Error(`GelatoRelaySDK/userAuthCall/transferFrom: Failed with error: ${errorMessage}`);
  }
};
