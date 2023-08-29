import {
  BaseCallWithSyncFeeParams,
  BaseRelayParams,
  EIP712Domain,
  Optional,
  SafeRequestPayload,
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

export const EIP712_SPONSORED_CALL_CONCURRENT_ERC2771_TYPE_DATA = {
  SponsoredCallConcurrentERC2771: [
    { name: "chainId", type: "uint256" },
    { name: "target", type: "address" },
    { name: "data", type: "bytes" },
    { name: "user", type: "address" },
    { name: "userSalt", type: "bytes32" },
    { name: "userDeadline", type: "uint256" },
  ],
};

export const EIP712_CALL_WITH_SYNC_FEE_CONCURRENT_ERC2771_TYPE_DATA = {
  CallWithSyncFeeConcurrentERC2771: [
    { name: "chainId", type: "uint256" },
    { name: "target", type: "address" },
    { name: "data", type: "bytes" },
    { name: "user", type: "address" },
    { name: "userSalt", type: "bytes32" },
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
  message: SafeRequestPayload<CallWithERC2771Struct>;
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
  message: SafeRequestPayload<CallWithERC2771Struct>;
};

export type SponsoredCallConcurrentERC2771PayloadToSign = {
  domain: EIP712Domain;
  types: {
    EIP712Domain?: {
      name: string;
      type: string;
    }[];
    SponsoredCallConcurrentERC2771: {
      name: string;
      type: string;
    }[];
  };
  primaryType?: "SponsoredCallConcurrentERC2771";
  message: SafeRequestPayload<CallWithConcurrentERC2771Struct>;
};

export type CallWithSyncFeeConcurrentERC2771PayloadToSign = {
  domain: EIP712Domain;
  types: {
    EIP712Domain?: {
      name: string;
      type: string;
    }[];
    CallWithSyncFeeConcurrentERC2771: {
      name: string;
      type: string;
    }[];
  };
  primaryType?: "CallWithSyncFeeConcurrentERC2771";
  message: SafeRequestPayload<CallWithConcurrentERC2771Struct>;
};

export type CallWithERC2771Struct = BaseRelayParams & ERC2771UserParams;

export type CallWithConcurrentERC2771Struct = BaseRelayParams &
  ConcurrentERC2771UserParams;

export type ERC2771UserParams = {
  user: string;
  userNonce: bigint;
  userDeadline: number;
};

export type ConcurrentERC2771UserParams = {
  user: string;
  userSalt: string;
  userDeadline: number;
};

export type CallWithERC2771Request = Optional<
  CallWithERC2771Struct,
  keyof CallWithERC2771RequestOptionalParameters
> & { isConcurrent?: false };

export type CallWithSyncFeeERC2771Request = CallWithERC2771Request &
  BaseCallWithSyncFeeParams;

export type CallWithConcurrentERC2771Request = Optional<
  CallWithConcurrentERC2771Struct,
  keyof CallWithConcurrentERC2771RequestOptionalParameters
> & { isConcurrent: true };

export type CallWithSyncFeeConcurrentERC2771Request =
  CallWithConcurrentERC2771Request & BaseCallWithSyncFeeParams;

export type CallWithERC2771RequestOptionalParameters = {
  userNonce: bigint;
  userDeadline: number;
};

export type CallWithConcurrentERC2771RequestOptionalParameters = {
  userDeadline: number;
  userSalt: string;
};

export type ConcurrentSignatureData = {
  struct: CallWithConcurrentERC2771Struct;
  signature: string;
};

export type SequentialSignatureData = {
  struct: CallWithERC2771Struct;
  signature: string;
};

export type SignatureData = ConcurrentSignatureData | SequentialSignatureData;

export type ConcurrentPayloadToSign = {
  struct: CallWithConcurrentERC2771Struct;
  typedData:
    | SponsoredCallConcurrentERC2771PayloadToSign
    | CallWithSyncFeeConcurrentERC2771PayloadToSign;
};

export type SequentialPayloadToSign = {
  struct: CallWithERC2771Struct;
  typedData:
    | SponsoredCallERC2771PayloadToSign
    | CallWithSyncFeeERC2771PayloadToSign;
};

export type PayloadToSign = ConcurrentPayloadToSign | SequentialPayloadToSign;

export enum ERC2771Type {
  CallWithSyncFee = "CallWithSyncFee",
  SponsoredCall = "SponsoredCall",
  ConcurrentCallWithSyncFee = "ConcurrentCallWithSyncFee",
  ConcurrentSponsoredCall = "ConcurrentSponsoredCall",
}
