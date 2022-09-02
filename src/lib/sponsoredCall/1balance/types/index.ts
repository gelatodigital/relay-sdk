import { BigNumberish, BytesLike } from "ethers";

export const EIP712_SPONSORED_CALL_WITH_1BALANCE_TYPE_DATA = {
  SponsoredCallWith1Balance: [
    { name: "chainId", type: "uint256" },
    { name: "target", type: "address" },
    { name: "data", type: "bytes" },
  ],
};

export type SponsoredCallWith1BalanceStruct = {
  chainId: BigNumberish;
  target: string;
  data: BytesLike;
  paymentType: BigNumberish;
};

export type SponsoredCallWith1BalanceRequest = SponsoredCallWith1BalanceStruct;
export type SponsoredCallWith1BalanceRequestOptionalParameters = Record<
  string,
  never
>;
