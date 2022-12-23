import { BigNumberish, BytesLike } from "ethers";

import { EIP712Domain, Optional } from "../../types";

export const EIP712_SPONSORED_CALL_ERC2771_TYPE_DATA = {
  SponsoredCallERC2771: [
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

export type SponsoredCallERC2771PayloadToSign = {
  domain: EIP712Domain;
  types: {
    EIP712Domain: {
      name: string;
      type: string;
    }[];
    SponsoredCallERC2771: {
      name: string;
      type: string;
    }[];
  };
  primaryType: "SponsoredCallERC2771";
  message: SponsoredCallERC2771Struct;
};

export type SponsoredCallERC2771Struct = {
  chainId: BigNumberish;
  target: string;
  data: BytesLike;
  user: string;
  userNonce: BigNumberish;
  userDeadline: BigNumberish;
};

export type SponsoredCallERC2771Request = Optional<
  SponsoredCallERC2771Struct,
  keyof SponsoredCallERC2771RequestOptionalParameters
>;

export type SponsoredCallERC2771RequestOptionalParameters = {
  userNonce: BigNumberish;
  userDeadline: BigNumberish;
};
