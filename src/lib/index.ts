import axios from "axios";
import { BytesLike, utils } from "ethers";
import { _TypedDataEncoder } from "ethers/lib/utils";
import { Oracle } from "@gelatonetwork/core-sdk";

import {
  GELATO_RELAY_URL,
  FORWARD_REQUEST_TYPEHASH,
  METATX_REQUEST_TYPEHASH,
} from "../constants";
import metaBoxABI from "../constants/abis/GelatoMetaBox.json";
import metaBoxPullFeeABI from "../constants/abis/GelatoMetaBoxPullFee.json";
import relayForwarderABI from "../constants/abis/GelatoRelayForwarder.json";
import relayForwarderPullFeeABI from "../constants/abis/GelatoRelayForwarderPullFee.json";
import {
  MetaTxRequest,
  EIP712ForwardRequestTypeData,
  EIP712MetaTxRequestTypeData,
  ForwardRequest,
} from "../types";
import {
  abiCoder,
  getMetaBoxAddress,
  getMetaBoxPullFeeAddress,
  getRelayForwarderAddress,
  getRelayForwarderPullFeeAddress,
  getEIP712Domain,
  getEIP712DomainSeparator,
} from "../utils";

const sendCallRequest = async (
  chainId: number,
  target: string,
  data: string,
  feeToken: string
): Promise<string> => {
  try {
    const response = await axios.post(
      `${GELATO_RELAY_URL}/metabox-relays/${chainId}`,
      {
        typeId: "ForwardCall",
        chainId,
        target,
        data,
        feeToken,
      }
    );

    return response.data.taskId;
  } catch (error) {
    const errorMsg = (error as Error).message ?? String(error);

    throw new Error(`sendCallRequest: Failed with error: ${errorMsg}`);
  }
};

const sendForwardRequest = async (
  request: ForwardRequest,
  sponsorSignature: BytesLike
): Promise<string> => {
  try {
    const response = await axios.post(
      `${GELATO_RELAY_URL}/metabox-relays/${request.chainId}`,
      {
        typeId: "ForwardRequest",
        ...request,
        sponsorSignature,
      }
    );

    return response.data.taskId;
  } catch (error) {
    const errorMsg = (error as Error).message ?? String(error);

    throw new Error(`sendForwardRequest: Failed with error: ${errorMsg}`);
  }
};

const sendMetaTxRequest = async (
  request: MetaTxRequest,
  userSignature: BytesLike,
  sponsorSignature?: BytesLike
): Promise<string> => {
  try {
    const response = await axios.post(
      `${GELATO_RELAY_URL}/metabox-relays/${request.chainId}`,
      {
        typeId: "MetaTxRequest",
        ...request,
        userSignature,
        sponsorSignature: sponsorSignature ?? userSignature,
      }
    );

    return response.data.taskId;
  } catch (error) {
    const errorMsg = (error as Error).message ?? String(error);

    throw new Error(`sendMetaTxRequest: Failed with error: ${errorMsg}`);
  }
};

const isChainSupported = async (chainId: number): Promise<boolean> => {
  try {
    const response = await axios.get(`${GELATO_RELAY_URL}/metabox-relays/`);
    const chainsSupportedByGelato: string[] = response.data.chainIds;

    return chainsSupportedByGelato.includes(chainId.toString());
  } catch (error) {
    const errorMsg = (error as Error).message ?? String(error);

    throw new Error(`isChainSupported: Failed with error: ${errorMsg}`);
  }
};

const getFeeTokens = async (chainId: number): Promise<string[]> => {
  return await Oracle.getPaymentTokens(chainId);
};

const getMetaBoxAddressAndABI = (
  chainId: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): { address: string; abi: any[] } => {
  const metaBoxAddress = getMetaBoxAddress(chainId);

  return { address: metaBoxAddress, abi: metaBoxABI };
};

const getMetaBoxPullFeeAddressAndABI = (
  chainId: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): { address: string; abi: any[] } => {
  const metaBoxPullFeeAddress = getMetaBoxPullFeeAddress(chainId);

  return { address: metaBoxPullFeeAddress, abi: metaBoxPullFeeABI };
};

const getRelayForwarderAddressAndABI = (
  chainId: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): { address: string; abi: any[] } => {
  const relayForwarderAddress = getRelayForwarderAddress(chainId);

  return { address: relayForwarderAddress, abi: relayForwarderABI };
};

const getRelayForwarderPullFeeAddressAndABI = (
  chainId: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): { address: string; abi: any[] } => {
  const relayForwarderPullFeeAddress = getMetaBoxAddress(chainId);

  return {
    address: relayForwarderPullFeeAddress,
    abi: relayForwarderPullFeeABI,
  };
};

const forwardRequest = (
  chainId: number,
  target: string,
  data: BytesLike,
  feeToken: string,
  paymentType: number,
  maxFee: string,
  nonce: number,
  enforceSponsorNonce: boolean,
  sponsor: string,
  sponsorChainId?: number
): ForwardRequest => {
  return {
    chainId,
    target,
    data,
    feeToken,
    paymentType,
    maxFee,
    sponsor,
    sponsorChainId: sponsorChainId ?? chainId,
    nonce,
    enforceSponsorNonce,
  };
};

const getForwardRequestDigestToSign = (request: ForwardRequest): string => {
  const isPullFee = request.paymentType === 3;

  const relayAddress = isPullFee
    ? getRelayForwarderPullFeeAddress(request.chainId)
    : getRelayForwarderAddress(request.chainId);

  const domainSeparator = getEIP712DomainSeparator(
    "GelatoRelayForwarder",
    "V1",
    request.chainId,
    relayAddress
  );

  const hash = utils.solidityKeccak256(
    ["bytes"],
    [
      abiCoder.encode(
        [
          "bytes32",
          "uint256",
          "address",
          "bytes32",
          "address",
          "uint256",
          "uint256",
          "address",
          "uint256",
          "uint256",
          "bool",
        ],
        [
          FORWARD_REQUEST_TYPEHASH,
          request.chainId,
          request.target,
          utils.solidityKeccak256(["bytes"], [request.data]),
          request.feeToken,
          request.paymentType,
          request.maxFee,
          request.sponsor,
          request.sponsorChainId,
          request.nonce,
          request.enforceSponsorNonce,
        ]
      ),
    ]
  );

  const digest = utils.solidityKeccak256(
    ["bytes"],
    [utils.hexConcat(["0x1901", domainSeparator, hash])]
  );

  return digest;
};

const metaTxRequest = (
  chainId: number,
  target: string,
  data: BytesLike,
  feeToken: string,
  paymentType: number,
  maxFee: string,
  user: string,
  nonce: number,
  sponsor?: string,
  sponsorChainId?: number,
  deadline?: number
): MetaTxRequest => {
  return {
    chainId,
    target,
    data,
    feeToken,
    paymentType,
    maxFee,
    user,
    sponsor: sponsor ?? user,
    sponsorChainId: sponsorChainId ?? chainId,
    nonce,
    deadline: deadline ?? 0,
  };
};

const getMetaTxRequestDigestToSign = (request: MetaTxRequest): string => {
  const isPullFee = request.paymentType === 3;

  const relayAddress = isPullFee
    ? getMetaBoxPullFeeAddress(request.chainId)
    : getMetaBoxAddress(request.chainId);

  const domainSeparator = getEIP712DomainSeparator(
    "GelatoMetaBox",
    "V1",
    request.chainId,
    relayAddress
  );

  const hash = utils.solidityKeccak256(
    ["bytes"],
    [
      abiCoder.encode(
        [
          "bytes32",
          "uint256",
          "address",
          "bytes32",
          "address",
          "uint256",
          "uint256",
          "address",
          "address",
          "uint256",
          "uint256",
          "uint256",
        ],
        [
          METATX_REQUEST_TYPEHASH,
          request.chainId,
          request.target,
          utils.solidityKeccak256(["bytes"], [request.data]),
          request.feeToken,
          request.paymentType,
          request.maxFee,
          request.user,
          request.sponsor,
          request.sponsorChainId,
          request.nonce,
          request.deadline,
        ]
      ),
    ]
  );

  const digest = utils.solidityKeccak256(
    ["bytes"],
    [utils.hexConcat(["0x1901", domainSeparator, hash])]
  );

  return digest;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getForwardRequestWalletPayloadToSign = (request: ForwardRequest): any => {
  const isPullFee = request.paymentType === 3;

  const verifyingContract = isPullFee
    ? getRelayForwarderPullFeeAddress(request.chainId)
    : getRelayForwarderAddress(request.chainId);

  const domain = getEIP712Domain(
    "GelatoRelayForwarder",
    "V1",
    request.chainId,
    verifyingContract
  );

  return _TypedDataEncoder.getPayload(
    domain,
    EIP712ForwardRequestTypeData,
    request
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getMetaTxRequestWalletPayloadToSign = (request: MetaTxRequest): any => {
  const isPullFee = request.paymentType === 3;

  const verifyingContract = isPullFee
    ? getMetaBoxPullFeeAddress(request.chainId)
    : getMetaBoxAddress(request.chainId);

  const domain = getEIP712Domain(
    "GelatoMetaBox",
    "V1",
    request.chainId,
    verifyingContract
  );

  return _TypedDataEncoder.getPayload(
    domain,
    EIP712MetaTxRequestTypeData,
    request
  );
};

export {
  isChainSupported,
  sendCallRequest,
  sendForwardRequest,
  sendMetaTxRequest,
  getFeeTokens,
  getMetaBoxAddressAndABI,
  getMetaBoxPullFeeAddressAndABI,
  getRelayForwarderAddressAndABI,
  getRelayForwarderPullFeeAddressAndABI,
  forwardRequest,
  metaTxRequest,
  getForwardRequestDigestToSign,
  getMetaTxRequestDigestToSign,
  getForwardRequestWalletPayloadToSign,
  getMetaTxRequestWalletPayloadToSign,
};
