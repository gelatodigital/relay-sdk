import { BigNumberish, BytesLike } from "ethers";
import { EIP712Domain } from "../../../../../types";
import { PromiseOrValue, SyncPayment } from "../../../types";

export const EIP712UserAuthCallWithTransferFromTypeData = {
  UserAuthCallWithTransferFrom: [
    { name: "chainId", type: "uint256" },
    { name: "target", type: "address" },
    { name: "data", type: "bytes" },
    { name: "user", type: "address" },
    { name: "userNonce", type: "uint256" },
    { name: "userDeadline", type: "uint256" },
    { name: "paymentType", type: "string" },
    { name: "feeToken", type: "address" },
    { name: "maxFee", type: "uint256" },
  ],
};

export type UserAuthCallWithTransferFromPayloadToSign = {
  domain: EIP712Domain;
  types: {
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

export type UserAuthCallWithTransferFromRequest = Omit<
  UserAuthCallWithTransferFromStruct,
  "paymentType"
>;

export type UserAuthCallWithTransferFrom = {
  relaySeparator: SyncPayment;
  relayData: UserAuthCallWithTransferFromRequest;
};