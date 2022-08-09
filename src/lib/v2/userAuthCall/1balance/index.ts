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

export type UserAuthCallWith1BalanceRequest = Omit<
  UserAuthCallRequest,
  "paymentType"
>;

const getPayloadToSign = (
  request: UserAuthCallWith1BalanceRequest
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
      paymentType: PaymentType.OneBalance,
    },
  };
};

export const userAuthCallWith1Balance = async (
  request: UserAuthCallWith1BalanceRequest,
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
