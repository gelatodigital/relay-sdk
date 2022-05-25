import axios from "axios";
import { BytesLike, utils } from "ethers";
import { _TypedDataEncoder } from "ethers/lib/utils";
import { Oracle, TransactionStatus } from "@gelatonetwork/core-sdk";

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

/**
 *
 * @param {number} chainId  - Chain ID.
 * @param {string} target   - Address of dApp's smart contract to call.
 * @param {string} data     - Payload for `target`.
 * @param {string} feeToken - paymentToken for Gelato Executors. Use `0xeee...` for native token.
 * @param {string} gas      - Gas limit.
 * @returns {PromiseLike<string>} taskId - Task ID.
 */
const sendCallRequest = async (
  chainId: number,
  target: string,
  data: string,
  feeToken: string,
  gas: string
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
        gas,
      }
    );

    return response.data.taskId;
  } catch (error) {
    const errorMsg = (error as Error).message ?? String(error);

    throw new Error(`sendCallRequest: Failed with error: ${errorMsg}`);
  }
};

/**
 *
 * @param {ForwardRequest} request  - ForwardRequest to be relayed by Gelato Executors.
 * @param {string} sponsorSignature - EIP-712 signature of sponsor (who pays Gelato Executors)
 * @returns {string} taskId         - Task ID.
 */
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

/**
 *
 * @param {MetaTxRequest} request   - MetaTxRequest to be relayed by Gelato Executors.
 * @param {string} userSignature    - EIP-712 signature from user:
 *                                    EOA that interacts with target dApp's address.
 * @param {string} sponsorSignature - EIP-712 signature from sponsor:
 *                                    EOA that pays Gelato Executors, could be same as user.
 * @returns {string} taskId         - Task ID.
 */
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

/**
 *
 * @param {number} chainId - Chain ID
 * @returns {boolean}
 */
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

/**
 *
 * @param {number} chainId - Chain ID.
 * @returns {PromiseLike<string[]>}
 */
const getFeeTokens = async (chainId: number): Promise<string[]> => {
  return await Oracle.getPaymentTokens(chainId);
};

/**
 *
 * @param {number} chainId - Chain ID.
 * @returns
 */
const getMetaBoxAddressAndABI = (
  chainId: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): { address: string; abi: any[] } => {
  const metaBoxAddress = getMetaBoxAddress(chainId);

  return { address: metaBoxAddress, abi: metaBoxABI };
};

/**
 *
 * @param {number} chainId - Chain ID.
 * @returns
 */
const getMetaBoxPullFeeAddressAndABI = (
  chainId: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): { address: string; abi: any[] } => {
  const metaBoxPullFeeAddress = getMetaBoxPullFeeAddress(chainId);

  return { address: metaBoxPullFeeAddress, abi: metaBoxPullFeeABI };
};

/**
 *
 * @param {number} chainId - Chain ID.
 * @returns
 */
const getRelayForwarderAddressAndABI = (
  chainId: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): { address: string; abi: any[] } => {
  const relayForwarderAddress = getRelayForwarderAddress(chainId);

  return { address: relayForwarderAddress, abi: relayForwarderABI };
};

/**
 *
 * @param {number} chainId - Chain ID.
 * @returns
 */
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

/**
 *
 * @param {number} chainId                        - Chain ID.
 * @param {string} target                         - Address of dApp's smart contract to call.
 * @param {string} data                           - Payload for `target`.
 * @param {string} feeToken                       - paymentToken for Gelato Executors. Use `0xeee...` for native token.
 * @param {number} paymentType                    - Type identifier for Gelato's payment. Can be 1, 2 or 3.
 * @param {string} maxFee                         - Maximum fee sponsor is willing to pay Gelato Executors.
 * @param {string} gas                            - Gas limit.
 * @param {number} nonce                          - Smart contract nonce for sponsor to sign.
 *                                                Can be 0 if enforceSponsorNonce is always false.
 * @param {boolean} enforceSponsorNonce           - Whether or not to enforce replay protection using sponsor's nonce.
 * @param {string} sponsor                        - EOA address that pays Gelato Executors.
 * @param {number} [sponsorChainId]               - Chain ID of where sponsor holds a Gas Tank balance with Gelato.
 *                                                  Relevant for paymentType=1. Defaults to `chainId` if not provided.
 * @param {boolean} [enforceSponsorNonceOrdering] - Whether or not ordering matters for concurrently submitted transactions.
 *                                                  Defaults to `true` if not provided.
 * @returns {ForwardRequest}
 */
const forwardRequest = (
  chainId: number,
  target: string,
  data: BytesLike,
  feeToken: string,
  paymentType: number,
  maxFee: string,
  gas: string,
  nonce: number,
  enforceSponsorNonce: boolean,
  sponsor: string,
  sponsorChainId?: number,
  enforceSponsorNonceOrdering?: boolean
): ForwardRequest => {
  return {
    chainId,
    target,
    data,
    feeToken,
    paymentType,
    maxFee,
    gas,
    sponsor,
    sponsorChainId: sponsorChainId ?? chainId,
    nonce,
    enforceSponsorNonce,
    enforceSponsorNonceOrdering: enforceSponsorNonceOrdering ?? true,
  };
};

/**
 *
 * @param {ForwardRequest} request - `ForwardRequest`
 * @returns {string} - EIP-712 compatible digest of `request` ready to be signed.
 */
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
          "uint256",
          "address",
          "uint256",
          "uint256",
          "bool",
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
          request.gas,
          request.sponsor,
          request.sponsorChainId,
          request.nonce,
          request.enforceSponsorNonce,
          request.enforceSponsorNonceOrdering,
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

/**
 *
 * @param {number} chainId          - Chain ID.
 * @param {string} target           - Address of dApp's smart contract to call.
 * @param {string} data             - Payload for `target`.
 * @param {string} feeToken         - paymentToken for Gelato Executors. Use `0xeee...` for native token.
 * @param {number} paymentType      - Type identifier for Gelato's payment. Can be 1, 2 or 3.
 * @param {string} maxFee           - Maximum fee sponsor is willing to pay Gelato Executors.
 * @param {string} gas              - Gas limit.
 * @param {string} user             - EOA of dApp's user
 * @param {number} nonce            - user's smart contract nonce.
 * @param {string} [sponsor]        - EOA that pays Gelato Executors.
 * @param {number} [sponsorChainId] - Chain ID where sponsor holds a balance with Gelato.
 *                                    Relevant for paymentType=1.
 * @param {number} [deadline]       - Deadline for executing MetaTxRequest, UNIX timestamp in seconds.
 *                                    Can also be 0 (not enforced).
 * @returns
 */
const metaTxRequest = (
  chainId: number,
  target: string,
  data: BytesLike,
  feeToken: string,
  paymentType: number,
  maxFee: string,
  gas: string,
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
    gas,
    user,
    sponsor: sponsor ?? user,
    sponsorChainId: sponsorChainId ?? chainId,
    nonce,
    deadline: deadline ?? 0,
  };
};

/**
 *
 * @param {MetaTxRequest} request - `MetaTxRequest`
 * @returns {string} - EIP-712 compatible digest of `request` ready to be signed.
 */
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
          request.gas,
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

/**
 *
 * @param {ForwardRequest} request - `ForwardRequest`
 * @returns {string} - Wallet compatible `request` ready to be signed.
 */
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

/**
 *
 * @param {MetaTxRequest} request - `MetaTxRequest`
 * @returns {string} - Wallet compatible `request` ready to be signed.
 */
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

/**
 *
 * @param taskId - Task ID.
 * @returns {PromiseLike<TransactionStatus | undefined}
 */
const getStatus = async (
  taskId: string
): Promise<TransactionStatus | undefined> => {
  let result: TransactionStatus | undefined;
  try {
    const res = await axios.get(
      `${GELATO_RELAY_URL}/tasks/GelatoMetaBox/${taskId}`
    );
    if (Array.isArray(res.data.data) && res.data.data.length > 0) {
      result = res.data.data[0];
    }
  } catch (error) {} // eslint-disable-line no-empty

  return result;
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
  getStatus,
  TransactionStatus,
};
