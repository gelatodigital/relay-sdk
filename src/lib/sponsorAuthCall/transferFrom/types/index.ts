import { BigNumberish, BytesLike } from "ethers";

import { Optional } from "../../../types";

export const EIP712_SPONSOR_AUTH_CALL_WITH_TRANSFER_FROM_TYPE_DATA = {
  SponsorAuthCallWithTransferFrom: [
    { name: "chainId", type: "uint256" },
    { name: "target", type: "address" },
    { name: "data", type: "bytes" },
    { name: "sponsor", type: "address" },
    { name: "sponsorSalt", type: "uint256" },
    { name: "paymentType", type: "uint8" },
    { name: "feeToken", type: "address" },
    { name: "maxFee", type: "uint256" },
  ],
};

export type SponsorAuthCallWithTransferFromStruct = {
  chainId: BigNumberish;
  target: string;
  data: BytesLike;
  sponsor: string;
  sponsorSalt: BigNumberish;
  paymentType: BigNumberish;
  feeToken: string;
  maxFee: BigNumberish;
};

export type SponsorAuthCallWithTransferFromRequest = Optional<
  Omit<SponsorAuthCallWithTransferFromStruct, "paymentType">,
  keyof SponsorAuthCallWithTransferFromRequestOptionalParameters
>;

export type SponsorAuthCallWithTransferFromRequestOptionalParameters = {
  sponsorSalt: BigNumberish;
};
