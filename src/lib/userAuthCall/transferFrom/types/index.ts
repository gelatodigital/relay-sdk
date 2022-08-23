import { BigNumberish, BytesLike } from "ethers";

import { EIP712Domain, Optional } from "../../../types";

export const EIP712_USER_AUTH_CALL_WITH_TRANSFER_FROM_TYPE_DATA = {
  EIP712Domain: [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
  ],
  UserAuthCallWithTransferFrom: [
    { name: "chainId", type: "uint256" },
    { name: "target", type: "address" },
    { name: "data", type: "bytes" },
    { name: "user", type: "address" },
    { name: "userNonce", type: "uint256" },
    { name: "userDeadline", type: "uint256" },
    { name: "paymentType", type: "uint8" },
    { name: "feeToken", type: "address" },
    { name: "maxFee", type: "uint256" },
  ],
};

export type UserAuthCallWithTransferFromPayloadToSign = {
  domain: EIP712Domain;
  types: {
    EIP712Domain: {
      name: string;
      type: string;
    }[];
    UserAuthCallWithTransferFrom: {
      name: string;
      type: string;
    }[];
  };
  primaryType: "UserAuthCallWithTransferFrom";
  message: UserAuthCallWithTransferFromStruct;
};

export type UserAuthCallWithTransferFromStruct = {
  chainId: BigNumberish;
  target: string;
  data: BytesLike;
  user: string;
  userNonce: BigNumberish;
  userDeadline: BigNumberish;
  paymentType: BigNumberish;
  feeToken: string;
  maxFee: BigNumberish;
};

export type UserAuthCallWithTransferFromRequest = Optional<
  Omit<UserAuthCallWithTransferFromStruct, "paymentType">,
  keyof UserAuthCallWithTransferFromRequestOptionalParameters
>;

export type UserAuthCallWithTransferFromRequestOptionalParameters = {
  userNonce: BigNumberish;
  userDeadline: BigNumberish;
};
