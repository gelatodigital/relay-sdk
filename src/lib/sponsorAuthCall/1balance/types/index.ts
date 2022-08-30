import { BigNumberish, BytesLike } from "ethers";

import { Optional } from "../../../types";

export const EIP712_SPONSOR_AUTH_CALL_WITH_1BALANCE_TYPE_DATA = {
  SponsorAuthCallWith1Balance: [
    { name: "chainId", type: "uint256" },
    { name: "target", type: "address" },
    { name: "data", type: "bytes" },
    { name: "sponsor", type: "address" },
    { name: "sponsorSalt", type: "uint256" },
    { name: "paymentType", type: "uint8" },
    { name: "feeToken", type: "address" },
    { name: "oneBalanceChainId", type: "uint256" },
  ],
};

export type SponsorAuthCallWith1BalanceStruct = {
  chainId: BigNumberish;
  target: string;
  data: BytesLike;
  sponsor: string;
  sponsorSalt: BigNumberish;
  paymentType: BigNumberish;
  feeToken: string;
  oneBalanceChainId: BigNumberish;
};

export type SponsorAuthCallWith1BalanceRequest = Optional<
  Omit<SponsorAuthCallWith1BalanceStruct, "paymentType" | "feeToken">,
  keyof SponsorAuthCallWith1BalanceRequestOptionalParameters
>;

export type SponsorAuthCallWith1BalanceRequestOptionalParameters = {
  sponsorSalt: BigNumberish;
};
