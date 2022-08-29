import { BigNumberish, BytesLike } from "ethers";

import { EIP712Domain, Optional } from "../../../types";

export const EIP712_USER_SPONSOR_AUTH_CALL_WITH_TRANSFER_FROM_TYPE_DATA = {
  UserSponsorAuthCallWithTransferFrom: [
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
    { name: "maxFee", type: "uint256" },
  ],
};

export type UserSponsorAuthCallWithTransferFromPayloadToSign = {
  domain: EIP712Domain;
  types: {
    EIP712Domain: {
      name: string;
      type: string;
    }[];
    UserSponsorAuthCallWithTransferFrom: {
      name: string;
      type: string;
    }[];
  };
  primaryType: "UserSponsorAuthCallWithTransferFrom";
  message: UserSponsorAuthCallWithTransferFromStruct;
};

export type UserSponsorAuthCallWithTransferFromStruct = {
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
  maxFee: BigNumberish;
};

export type UserSponsorAuthCallWithTransferFromRequest = Optional<
  Omit<UserSponsorAuthCallWithTransferFromStruct, "paymentType">,
  keyof UserSponsorAuthCallWithTransferFromRequestOptionalParameters
>;

export type UserSponsorAuthCallWithTransferFromRequestOptionalParameters = {
  userNonce: BigNumberish;
  userDeadline: BigNumberish;
};
