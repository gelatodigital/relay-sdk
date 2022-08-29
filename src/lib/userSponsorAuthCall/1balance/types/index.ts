import { BigNumberish, BytesLike } from "ethers";

import { EIP712Domain, Optional } from "../../../types";

export const EIP712_USER_SPONSOR_AUTH_CALL_WITH_1BALANCE_TYPE_DATA = {
  UserSponsorAuthCallWith1Balance: [
    { name: "chainId", type: "uint256" },
    { name: "target", type: "address" },
    { name: "data", type: "bytes" },
    { name: "user", type: "address" },
    { name: "userNonce", type: "uint256" },
    { name: "userDeadline", type: "uint256" },
    { name: "sponsor", type: "address" },
    { name: "sponsorSalt", type: "uint256" },
    { name: "paymentType", type: "uint8" },
    { name: "feeToken", type: "address" },
    { name: "oneBalanceChainId", type: "uint256" },
  ],
};

export type UserSponsorAuthCallWith1BalancePayloadToSign = {
  domain: EIP712Domain;
  types: {
    EIP712Domain: {
      name: string;
      type: string;
    }[];
    UserSponsorAuthCallWith1Balance: {
      name: string;
      type: string;
    }[];
  };
  primaryType: "UserSponsorAuthCallWith1Balance";
  message: UserSponsorAuthCallWith1BalanceStruct;
};

export type UserSponsorAuthCallWith1BalanceStruct = {
  chainId: BigNumberish;
  target: string;
  data: BytesLike;
  user: string;
  userNonce: BigNumberish;
  userDeadline: BigNumberish;
  sponsor: string;
  sponsorSalt: BigNumberish;
  paymentType: BigNumberish;
  feeToken: string;
  oneBalanceChainId: BigNumberish;
};

export type UserSponsorAuthCallWith1BalanceRequest = Optional<
  Omit<UserSponsorAuthCallWith1BalanceStruct, "paymentType" | "feeToken">,
  keyof UserSponsorAuthCallWith1BalanceRequestOptionalParameters
>;

export type UserSponsorAuthCallWith1BalanceRequestOptionalParameters = {
  userNonce: BigNumberish;
  userDeadline: BigNumberish;
};
