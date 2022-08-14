import { BigNumberish, BytesLike } from "ethers";
import { AsyncPayment, PromiseOrValue } from "../../../types";

export const EIP712UserAuthCallWith1BalanceTypeData = {
  UserAuthCall: [
    { name: "chainId", type: "uint256" },
    { name: "target", type: "address" },
    { name: "data", type: "bytes" },
    { name: "user", type: "address" },
    { name: "userNonce", type: "uint256" },
    { name: "userDeadline", type: "uint256" },
    { name: "paymentType", type: "string" },
    { name: "feeToken", type: "address" },
    { name: "oneBalanceChainId", type: "uint256" }
  ],
};

export type UserAuthCallWith1BalanceStruct = {
  chainId: PromiseOrValue<BigNumberish>;
  target: PromiseOrValue<string>;
  data: PromiseOrValue<BytesLike>;
  user: PromiseOrValue<string>;
  userNonce: PromiseOrValue<BigNumberish>;
  userDeadline?: PromiseOrValue<BigNumberish>;
  paymentType: PromiseOrValue<BigNumberish>;
  feeToken: PromiseOrValue<string>;
  oneBalanceChainId: PromiseOrValue<BigNumberish>;
};

export type UserAuthCallWith1BalanceRequest = Omit<
  UserAuthCallWith1BalanceStruct,
  "paymentType"
>;

export type UserAuthCallWith1Balance = {
  relaySeparator: AsyncPayment;
  relayData: UserAuthCallWith1BalanceRequest;
};
