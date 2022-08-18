import { BigNumberish, BytesLike } from "ethers";
import { EIP712Domain } from "../../../../../types";
import { AsyncPayment, Optional, PromiseOrValue } from "../../../types";

export const EIP712UserAuthCallWith1BalanceTypeData = {
  EIP712Domain: [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
  ],
  UserAuthCallWith1Balance: [
    { name: "chainId", type: "uint256" },
    { name: "target", type: "address" },
    { name: "data", type: "bytes" },
    { name: "user", type: "address" },
    { name: "userNonce", type: "uint256" },
    { name: "userDeadline", type: "uint256" },
    { name: "paymentType", type: "uint8" },
    { name: "feeToken", type: "address" },
    { name: "oneBalanceChainId", type: "uint256" },
  ],
};

export type UserAuthCallWith1BalancePayloadToSign = {
  domain: EIP712Domain;
  types: {
    EIP712Domain: {
      name: string;
      type: string;
    }[];
    UserAuthCallWith1Balance: {
      name: string;
      type: string;
    }[];
  };
  primaryType: "UserAuthCallWith1Balance";
  message: UserAuthCallWith1BalanceStruct;
};

export type UserAuthCallWith1BalanceStruct = {
  chainId: PromiseOrValue<BigNumberish>;
  target: PromiseOrValue<string>;
  data: PromiseOrValue<BytesLike>;
  user: PromiseOrValue<string>;
  userNonce: PromiseOrValue<BigNumberish>;
  userDeadline: PromiseOrValue<BigNumberish>;
  paymentType: PromiseOrValue<BigNumberish>;
  feeToken: PromiseOrValue<string>;
  oneBalanceChainId: PromiseOrValue<BigNumberish>;
};

export type UserAuthCallWith1BalanceRequest = Optional<
  Omit<UserAuthCallWith1BalanceStruct, "paymentType" | "feeToken">,
  keyof UserAuthCallWith1BalanceRequestOptionalParameters
>;

export type UserAuthCallWith1BalanceRequestOptionalParameters = {
  userNonce: PromiseOrValue<BigNumberish>;
  userDeadline: PromiseOrValue<BigNumberish>;
};

export type UserAuthCallWith1Balance = {
  relaySeparator: AsyncPayment;
  relayData: UserAuthCallWith1BalanceRequest;
};
