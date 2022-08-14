import { providers } from "ethers";
import { getMetaBoxAddress } from "../../../../constants";
import { getEIP712Domain } from "../../../../utils";
import { PaymentType } from "../../types";
import { signTypedDataV4 } from "../../utils";
import { UserAuthCallPayloadToSign } from "../types";
import {
  EIP712UserAuthCallWithTransferFromTypeData,
  UserAuthCallWithTransferFromRequest,
  UserAuthCallWithTransferFromStruct,
} from "./types";

const getPayloadToSign = (
  request: UserAuthCallWithTransferFromRequest
): UserAuthCallPayloadToSign<UserAuthCallWithTransferFromStruct> => {
  const verifyingContract = getMetaBoxAddress(request.chainId as number); //TODO: To be changed
  const domain = getEIP712Domain(
    "GelatoMetaBox",
    "V1",
    request.chainId as number,
    verifyingContract
  );
  return {
    domain,
    types: EIP712UserAuthCallWithTransferFromTypeData,
    primaryType: "UserAuthCall",
    message: {
      paymentType: PaymentType.TransferFrom,
      chainId: request.chainId,
      data: request.data,
      feeToken: request.feeToken,
      maxFee: request.maxFee,
      target: request.target,
      user: request.user,
      userNonce: request.userNonce,
      userDeadline: request.userDeadline,
    },
  };
};

export const userAuthCallWithTransferFrom = async (
  request: UserAuthCallWithTransferFromRequest,
  provider: providers.Web3Provider
): Promise<string> => {
  try {
    const signature = await signTypedDataV4(
      provider,
      request.user as string,
      JSON.stringify(getPayloadToSign(request))
    );
    return signature;
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw Error(`An error occurred: ${errorMessage}`);
  }
};
