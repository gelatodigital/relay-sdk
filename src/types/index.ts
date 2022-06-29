import { BytesLike } from "ethers";

type EIP712Domain = {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
};

const EIP712ForwardRequestTypeData = {
  ForwardRequest: [
    { name: "chainId", type: "uint256" },
    { name: "target", type: "address" },
    { name: "data", type: "bytes" },
    { name: "feeToken", type: "address" },
    { name: "paymentType", type: "uint256" },
    { name: "maxFee", type: "uint256" },
    { name: "gas", type: "uint256" },
    { name: "sponsor", type: "address" },
    { name: "sponsorChainId", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "enforceSponsorNonce", type: "bool" },
    { name: "enforceSponsorNonceOrdering", type: "bool" },
  ],
};

const EIP712MetaTxRequestTypeData = {
  MetaTxRequest: [
    { name: "chainId", type: "uint256" },
    { name: "target", type: "address" },
    { name: "data", type: "bytes" },
    { name: "feeToken", type: "address" },
    { name: "paymentType", type: "uint256" },
    { name: "maxFee", type: "uint256" },
    { name: "gas", type: "uint256" },
    { name: "user", type: "address" },
    { name: "sponsor", type: "address" },
    { name: "sponsorChainId", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
};

type ForwardCallParams = {
  chainId: number;
  target: string;
  data: BytesLike;
  feeToken: string;
  gas: string;
};

type ForwardRequest = {
  chainId: number;
  target: string;
  data: BytesLike;
  feeToken: string;
  paymentType: number;
  maxFee: string;
  gas: string;
  sponsor: string;
  sponsorChainId: number;
  nonce: number;
  enforceSponsorNonce: boolean;
  enforceSponsorNonceOrdering: boolean;
};

type MetaTxRequest = {
  chainId: number;
  target: string;
  data: BytesLike;
  feeToken: string;
  paymentType: number;
  maxFee: string;
  gas: string;
  user: string;
  sponsor: string;
  sponsorChainId: number;
  nonce: number;
  deadline: number;
};

export {
  ForwardCallParams,
  ForwardRequest,
  MetaTxRequest,
  EIP712Domain,
  EIP712ForwardRequestTypeData,
  EIP712MetaTxRequestTypeData,
};
