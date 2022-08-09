import { providers } from "ethers";
import { getMetaBoxAddress } from "../../../../constants";
import { getEIP712Domain } from "../../../../utils";
import { PaymentType } from "../../types";
import { signTypedDataV4 } from "../../utils";
import {
  EIP712UserAuthCallTypeData,
  UserAuthCallPayloadToSign,
  UserAuthCallRequest,
} from "../types";

export type UserAuthCallWithTransferFromRequest = Omit<
  UserAuthCallRequest,
  "paymentType" | "oneBalanceChainId"
>;

const getPayloadToSign = (
  request: UserAuthCallWithTransferFromRequest
): UserAuthCallPayloadToSign<UserAuthCallRequest> => {
  const verifyingContract = getMetaBoxAddress(request.chainId); //TODO: To be changed
  const domain = getEIP712Domain(
    "GelatoMetaBox",
    "V1",
    request.chainId,
    verifyingContract
  );
  return {
    domain,
    types: EIP712UserAuthCallTypeData,
    primaryType: "UserAuthCall",
    message: {
      ...request,
      paymentType: PaymentType.TransferFrom,
      oneBalanceChainId: "0",
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
      request.user,
      JSON.stringify(getPayloadToSign(request))
    );
    return signature;
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw Error(`An error occurred: ${errorMessage}`);
  }
};
