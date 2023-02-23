import { BigNumber, ethers } from "ethers";

import * as library from "./lib";
import { CallWithSyncFeeRequest } from "./lib/callWithSyncFee/types";
import { SponsoredCallRequest } from "./lib/sponsoredCall/types";
import {
  SignatureData,
  SponsoredCallERC2771Request,
} from "./lib/erc2771/types";
import { TransactionStatusResponse } from "./lib/status/types";
import { RelayRequestOptions, RelayResponse } from "./lib/types";

export {
  CallWithSyncFeeRequest,
  SponsoredCallERC2771Request,
  SponsoredCallRequest,
  RelayRequestOptions,
  TransactionStatusResponse,
  RelayResponse,
  SignatureData,
};
export class GelatoRelay {
  /**
   * @param {CallWithSyncFeeRequest} request - CallWithSyncFee request to be relayed by Gelato Executors
   * @param {RelayRequestOptions} [options] - Optional Relay configuration
   * @returns {Promise<RelayResponse>} Response object with taskId parameter
   *
   */
  callWithSyncFee = (
    request: CallWithSyncFeeRequest,
    options?: RelayRequestOptions
  ): Promise<RelayResponse> => library.relayWithSyncFee(request, options);

  /**
   * @param {SponsoredCallRequest} request SponsoredCallRequest to be relayed by the Gelato Executors.
   * @param {string} sponsorApiKey Sponsor API key to be used for the call
   * @param {RelayRequestOptions} [options] Optional Relay configuration
   * @returns {Promise<RelayResponse>} Response object with taskId parameter
   *
   */
  sponsoredCall = (
    request: SponsoredCallRequest,
    sponsorApiKey: string,
    options?: RelayRequestOptions
  ): Promise<RelayResponse> =>
    library.relayWithSponsoredCall(request, sponsorApiKey, options);

  /**
   * @param {SponsoredCallERC2771Request} request - SponsoredCallERC2771Request to be relayed by Gelato Executors
   * @param {ethers.providers.Web3Provider} provider - Web3Provider to sign the payload
   * @param {string} sponsorApiKey - Sponsor API key
   * @param {RelayRequestOptions} [options] - Optional Relay configuration
   * @returns {Promise<RelayResponse>} Response object with taskId parameter
   *
   */
  sponsoredCallERC2771 = (
    request: SponsoredCallERC2771Request,
    provider: ethers.providers.Web3Provider,
    sponsorApiKey: string,
    options?: RelayRequestOptions
  ): Promise<RelayResponse> =>
    library.relayWithSponsoredCallERC2771(
      request,
      provider,
      sponsorApiKey,
      options
    );

  /**
   * @param {SponsoredCallERC2771Request} request - SponsoredCallERC2771Request to be relayed by Gelato Executors
   * @param {ethers.providers.Web3Provider} provider - Web3Provider to sign the payload
   * @param {ethers.Wallet} wallet - A Wallet to sign the payload in lieu of Web3Provider
   * @returns {Promise<SignatureData>} Response object with taskId parameter
   *
   */
  getSignatureDataERC2771 = (
    request: SponsoredCallERC2771Request,
    provider: ethers.providers.Web3Provider,
    wallet?: ethers.Wallet
  ): Promise<SignatureData> =>
    library.getSignatureDataERC2771(request, provider, wallet);

  /**
   * @param {SignatureData["struct"]} struct - Struct that can be obtained from getSignatureDataERC2771
   * @param {SignatureData["signature"]} signature - Signature that can be obtained from getSignatureDataERC2771
   * @param {string} sponsorApiKey - Sponsor API key
   * @param {RelayRequestOptions} [options] - Optional Relay configuration
   * @returns {Promise<RelayResponse>} Response object with taskId parameter
   *
   */
  sponsoredCallERC2771WithSignature = (
    struct: SignatureData["struct"],
    signature: SignatureData["signature"],
    sponsorApiKey: string,
    options?: RelayRequestOptions
  ): Promise<RelayResponse> =>
    library.sponsoredCallERC2771WithSignature(
      struct,
      signature,
      sponsorApiKey,
      options
    );

  /**
   * @param {number} chainId - Chain Id
   * @returns {Promise<boolean>} Boolean to demonstrate if Relay V2 is supported on the provided chain
   */
  isNetworkSupported = (chainId: number): Promise<boolean> =>
    library.isNetworkSupported(chainId);

  /**
   * @returns {Promise<string[]>} List of networks where Relay V2 is supported
   */
  getSupportedNetworks = (): Promise<string[]> =>
    library.getSupportedNetworks();

  /**
   * @param {number} chainId - Chain Id
   * @returns {Promise<boolean>} Boolean to demonstrate if the oracle is active on the provided chain
   */
  isOracleActive = (chainId: number): Promise<boolean> =>
    library.isOracleActive(chainId);

  /**
   * @returns {Promise<string[]>} List of chain ids where the Gelato Oracle is active
   */
  getGelatoOracles = (): Promise<string[]> => library.getGelatoOracles();

  /**
   * @param {number} chainId - Chain Id
   * @returns {Promise<string[]>} List of all payment tokens on the provided chain
   *
   */
  getPaymentTokens = (chainId: number): Promise<string[]> =>
    library.getPaymentTokens(chainId);

  /**
   * @param {number} chainId - Chain Id
   * @param {string} paymentToken - Payment Token
   * @param {BigNumber} gasLimit - Gas Limit
   * @param {boolean} isHighPriority - Priority Level
   * @param {BigNumber} [gasLimitL1=BigNumber.from(0)] - Gas Limit for Layer 1
   * @returns {Promise<BigNumber>} Estimated Fee
   *
   */
  getEstimatedFee = (
    chainId: number,
    paymentToken: string,
    gasLimit: BigNumber,
    isHighPriority: boolean,
    gasLimitL1: BigNumber = BigNumber.from(0)
  ): Promise<BigNumber> =>
    library.getEstimatedFee(
      chainId,
      paymentToken,
      gasLimit,
      isHighPriority,
      gasLimitL1
    );

  /**
   * @param {string} taskId - Task Id
   * @returns {Promise<TransactionStatusResponse | undefined>} Transaction status of the task id
   *
   */
  getTaskStatus = (
    taskId: string
  ): Promise<TransactionStatusResponse | undefined> =>
    library.getTaskStatus(taskId);
}
