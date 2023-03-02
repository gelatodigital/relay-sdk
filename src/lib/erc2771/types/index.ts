import { BigNumberish } from "ethers";

import {
  BaseCallWithSyncFeeParams,
  BaseRelayParams,
  EIP712Domain,
  Optional,
} from "../../types";

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

export const EIP712_CALL_WITH_SYNC_FEE_ERC2771_TYPE_DATA = {
  CallWithSyncFeeERC2771: [
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
    EIP712Domain?: {
      name: string;
      type: string;
    }[];
    SponsoredCallERC2771: {
      name: string;
      type: string;
    }[];
  };
  primaryType?: "SponsoredCallERC2771";
  message: CallWithERC2771Struct;
};

export type CallWithSyncFeeERC2771PayloadToSign = {
  domain: EIP712Domain;
  types: {
    EIP712Domain?: {
      name: string;
      type: string;
    }[];
    CallWithSyncFeeERC2771: {
      name: string;
      type: string;
    }[];
  };
  primaryType?: "CallWithSyncFeeERC2771";
  message: CallWithERC2771Struct;
};

export type CallWithERC2771Struct = BaseRelayParams & ERC2771UserParams;

export type ERC2771UserParams = {
  user: string;
  userNonce: BigNumberish;
  userDeadline: BigNumberish;
};

export type CallWithERC2771Request = Optional<
  CallWithERC2771Struct,
  keyof CallWithERC2771RequestOptionalParameters
>;

export type CallWithSyncFeeERC2771Request = CallWithERC2771Request &
  BaseCallWithSyncFeeParams;

export type CallWithERC2771RequestOptionalParameters = {
  userNonce: BigNumberish;
  userDeadline: BigNumberish;
};

export type SignatureData = {
  struct: CallWithERC2771Struct;
  signature: string;
};

export enum ERC2771Type {
  CallWithSyncFee = "CallWithSyncFee",
  SponsoredCall = "SponsoredCall",
}
