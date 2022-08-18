import { BigNumberish, BytesLike } from "ethers";
import { EIP712Domain } from "../../../../../types";
import { Optional, PromiseOrValue, SyncPayment } from "../../../types";

export const EIP712UserAuthCallWithTransferFromTypeData = {
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
  chainId: PromiseOrValue<BigNumberish>;
  target: PromiseOrValue<string>;
  data: PromiseOrValue<BytesLike>;
  user: PromiseOrValue<string>;
  userNonce: PromiseOrValue<BigNumberish>;
  userDeadline: PromiseOrValue<BigNumberish>;
  paymentType: PromiseOrValue<BigNumberish>;
  feeToken: PromiseOrValue<string>;
  maxFee: PromiseOrValue<BigNumberish>;
};

export type UserAuthCallWithTransferFromRequest = Optional<
  Omit<UserAuthCallWithTransferFromStruct, "paymentType">,
  keyof UserAuthCallWithTransferFromRequestOptionalParameters
>;

export type UserAuthCallWithTransferFromRequestOptionalParameters = {
  userNonce: PromiseOrValue<BigNumberish>;
  userDeadline: PromiseOrValue<BigNumberish>;
};

export type UserAuthCallWithTransferFrom = {
  relaySeparator: SyncPayment;
  relayData: UserAuthCallWithTransferFromRequest;
};
