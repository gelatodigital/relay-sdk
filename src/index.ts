import { BigNumber, ethers } from "ethers";

import * as library from "./lib";
import { CallWithSyncFeeRequest } from "./lib/callWithSyncFee/types";
import { SponsoredCallRequest } from "./lib/sponsoredCall/types";
import {
  SignatureData,
  CallWithERC2771Request,
  ERC2771Type,
  CallWithSyncFeeERC2771Request,
} from "./lib/erc2771/types";
import { TransactionStatusResponse } from "./lib/status/types";
import {
  BaseCallWithSyncFeeParams,
  Config,
  RelayRequestOptions,
  RelayResponse,
} from "./lib/types";
import { GELATO_RELAY_ERC2771_ADDRESS, GELATO_RELAY_URL } from "./constants";

export {
  CallWithSyncFeeRequest,
  CallWithERC2771Request,
  SponsoredCallRequest,
  RelayRequestOptions,
  TransactionStatusResponse,
  RelayResponse,
  SignatureData,
  ERC2771Type,
  CallWithSyncFeeERC2771Request,
  BaseCallWithSyncFeeParams,
};
export class GelatoRelay {
  #config: Config;

  constructor(config?: Partial<Config>) {
    this.#config = this._getConfiguration(config);
  }

  /**
   * @param {Config} config Configuration
   */
  configure = (config: Partial<Config>) => {
    this.#config = this._getConfiguration(config);
  };

  private _getConfiguration = (config?: Partial<Config>): Config => {
    return {
      url: config?.url ?? GELATO_RELAY_URL,
      contract: {
        relayERC2771:
          config?.contract?.relayERC2771 ?? GELATO_RELAY_ERC2771_ADDRESS,
      },
    };
  };

  /**
   * @param {CallWithSyncFeeRequest} request - CallWithSyncFee request to be relayed by Gelato Executors
   * @param {RelayRequestOptions} [options] - Optional Relay configuration
   * @returns {Promise<RelayResponse>} Response object with taskId parameter
   *
   */
  callWithSyncFee = (
    request: CallWithSyncFeeRequest,
    options?: RelayRequestOptions
  ): Promise<RelayResponse> =>
    library.relayWithSyncFee({ request, options }, this.#config);

  /**
   * @param {CallWithSyncFeeERC2771Request} request - CallWithSyncFeeERC2771 request to be relayed by Gelato Executors
   * @param {ethers.providers.Web3Provider | ethers.Wallet} walletOrProvider - Web3Provider [front-end] or Wallet [back-end] to sign the payload
   * @param {RelayRequestOptions} [options] - Optional Relay configuration
   * @returns {Promise<RelayResponse>} Response object with taskId parameter
   *
   */
  callWithSyncFeeERC2771 = (
    request: CallWithSyncFeeERC2771Request,
    walletOrProvider: ethers.providers.Web3Provider | ethers.Wallet,
    options?: RelayRequestOptions
  ): Promise<RelayResponse> =>
    library.relayWithCallWithSyncFeeERC2771(
      {
        request,
        walletOrProvider,
        options,
      },
      this.#config
    );

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
    library.relayWithSponsoredCall(
      { request, sponsorApiKey, options },
      this.#config
    );

  /**
   * @param {CallWithERC2771Request} request - CallWithERC2771Request to be relayed by Gelato Executors
   * @param {ethers.providers.Web3Provider | ethers.Wallet} walletOrProvider - Web3Provider [front-end] or Wallet [back-end] to sign the payload
   * @param {string} sponsorApiKey - Sponsor API key
   * @param {RelayRequestOptions} [options] - Optional Relay configuration
   * @returns {Promise<RelayResponse>} Response object with taskId parameter
   *
   */
  sponsoredCallERC2771 = (
    request: CallWithERC2771Request,
    walletOrProvider: ethers.providers.Web3Provider | ethers.Wallet,
    sponsorApiKey: string,
    options?: RelayRequestOptions
  ): Promise<RelayResponse> =>
    library.relayWithSponsoredCallERC2771(
      {
        request,
        walletOrProvider,
        sponsorApiKey,
        options,
      },
      this.#config
    );

  /**
   * @param {CallWithERC2771Request} request - CallWithERC2771Request to be relayed by Gelato Executors
   * @param {ethers.providers.Web3Provider | ethers.Wallet} walletOrProvider - Web3Provider [front-end] or Wallet [back-end] to sign the payload
   * @param {ERC2771Type} type - ERC2771Type.CallWithSyncFee or ERC2771Type.SponsoredCall
   * @returns {Promise<SignatureData>} Response object with taskId parameter
   *
   */
  getSignatureDataERC2771 = (
    request: CallWithERC2771Request,
    walletOrProvider: ethers.providers.Web3Provider | ethers.Wallet,
    type: ERC2771Type
  ): Promise<SignatureData> =>
    library.getSignatureDataERC2771(
      { request, walletOrProvider, type },
      this.#config
    );

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
      {
        struct,
        signature,
        sponsorApiKey,
        options,
      },
      this.#config
    );

  /**
   * @param {SignatureData["struct"]} struct - Struct that can be obtained from getSignatureDataERC2771
   * @param {BaseCallWithSyncFeeParams} syncFeeParams - Call with Sync Fee parameters
   * @param {SignatureData["signature"]} signature - Signature that can be obtained from getSignatureDataERC2771
   * @param {RelayRequestOptions} [options] - Optional Relay configuration
   * @returns {Promise<RelayResponse>} Response object with taskId parameter
   *
   */
  callWithSyncFeeERC2771WithSignature = (
    struct: SignatureData["struct"],
    syncFeeParams: BaseCallWithSyncFeeParams,
    signature: SignatureData["signature"],
    options?: RelayRequestOptions
  ): Promise<RelayResponse> =>
    library.callWithSyncFeeERC2771WithSignature(
      {
        struct,
        syncFeeParams,
        signature,
        options,
      },
      this.#config
    );

  /**
   * @param {number} chainId - Chain Id
   * @returns {Promise<boolean>} Boolean to demonstrate if Relay V2 is supported on the provided chain
   */
  isNetworkSupported = (chainId: number): Promise<boolean> =>
    library.isNetworkSupported({ chainId }, this.#config);

  /**
   * @returns {Promise<string[]>} List of networks where Relay V2 is supported
   */
  getSupportedNetworks = (): Promise<string[]> =>
    library.getSupportedNetworks(this.#config);

  /**
   * @param {number} chainId - Chain Id
   * @returns {Promise<boolean>} Boolean to demonstrate if the oracle is active on the provided chain
   */
  isOracleActive = (chainId: number): Promise<boolean> =>
    library.isOracleActive({ chainId }, this.#config);

  /**
   * @returns {Promise<string[]>} List of chain ids where the Gelato Oracle is active
   */
  getGelatoOracles = (): Promise<string[]> =>
    library.getGelatoOracles(this.#config);

  /**
   * @param {number} chainId - Chain Id
   * @returns {Promise<string[]>} List of all payment tokens on the provided chain
   *
   */
  getPaymentTokens = (chainId: number): Promise<string[]> =>
    library.getPaymentTokens({ chainId }, this.#config);

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
      { chainId, paymentToken, gasLimit, isHighPriority, gasLimitL1 },
      this.#config
    );

  /**
   * @param {string} taskId - Task Id
   * @returns {Promise<TransactionStatusResponse | undefined>} Transaction status of the task id
   *
   */
  getTaskStatus = (
    taskId: string
  ): Promise<TransactionStatusResponse | undefined> =>
    library.getTaskStatus({ taskId }, this.#config);
}
