import { BigNumberish, BytesLike } from "ethers";

import { EIP712Domain, Optional } from "../../types";

export const EIP712_SPONSORED_USER_AUTH_CALL_TYPE_DATA = {
  SponsoredUserAuthCall: [
    { name: "chainId", type: "uint256" },
    { name: "target", type: "address" },
    { name: "data", type: "bytes" },
    { name: "user", type: "address" },
    { name: "userNonce", type: "uint256" },
    { name: "userDeadline", type: "uint256" },
  ],
};

export type UserAuthSignature = {
  userSignature: string;
};

export type SponsoredUserAuthCallPayloadToSign = {
  domain: EIP712Domain;
  types: {
    EIP712Domain: {
      name: string;
      type: string;
    }[];
    SponsoredUserAuthCall: {
      name: string;
      type: string;
    }[];
  };
  primaryType: "SponsoredUserAuthCall";
  message: SponsoredUserAuthCallStruct;
};

export type SponsoredUserAuthCallStruct = {
  chainId: BigNumberish;
  target: string;
  data: BytesLike;
  user: string;
  userNonce: BigNumberish;
  userDeadline: BigNumberish;
};

export type SponsoredUserAuthCallRequest = Optional<
  SponsoredUserAuthCallStruct,
  keyof SponsoredUserAuthCallRequestOptionalParameters
>;

export type SponsoredUserAuthCallRequestOptionalParameters = {
  userNonce: BigNumberish;
  userDeadline: BigNumberish;
};
