import { BytesLike } from "ethers";

type EIP712Domain = {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
};

const EIP712ForwardRequestTypeData = {
  Request: [
    { name: "chainId", type: "uint256" },
    { name: "target", type: "address" },
    { name: "data", type: "bytes" },
    { name: "feeToken", type: "address" },
    { name: "paymentType", type: "uint256" },
    { name: "maxFee", type: "uint256" },
    { name: "sponsor", type: "address" },
    { name: "sponsorChainId", type: "uint256" },
    { name: "nonce", type: "uint256" },
  ],
};

const EIP712MetaTxRequestTypeData = {
  Request: [
    { name: "chainId", type: "uint256" },
    { name: "target", type: "address" },
    { name: "data", type: "bytes" },
    { name: "feeToken", type: "address" },
    { name: "paymentType", type: "uint256" },
    { name: "maxFee", type: "uint256" },
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
};

type ForwardRequest = ForwardCallParams & {
  paymentType: number;
  maxFee: string;
  sponsor: string;
  sponsorChainId: number;
  nonce: number;
  enforceSponsorNonce: boolean;
};

type MetaTxRequest = ForwardCallParams & {
  paymentType: number;
  maxFee: string;
  user: string;
  sponsor: string;
  sponsorChainId: number;
  nonce: number;
  deadline: number;
};

export {
  ForwardRequest,
  MetaTxRequest,
  EIP712Domain,
  EIP712ForwardRequestTypeData,
  EIP712MetaTxRequestTypeData,
};
