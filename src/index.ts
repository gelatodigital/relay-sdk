import * as library from "./lib";
import { CallWithSyncFeeRequest } from "./lib/callWithSyncFee/types";
import { SponsoredCallRequest } from "./lib/sponsoredCall/types";
import {
  SignatureData,
  PayloadToSign,
  CallWithERC2771Request,
  ERC2771Type,
  CallWithSyncFeeERC2771Request,
  CallWithSyncFeeConcurrentERC2771Request,
  CallWithConcurrentERC2771Request,
} from "./lib/erc2771/types";
import { TransactionStatusResponse, TaskState } from "./lib/status/types";
import {
  BaseCallWithSyncFeeParams,
  Config,
  RelayRequestOptions,
  RelayResponse,
  SignerOrProvider,
} from "./lib/types";
import {
  GELATO_RELAY_1BALANCE_ERC2771_ADDRESS,
  GELATO_RELAY_1BALANCE_ERC2771_ZKSYNC_ADDRESS,
  GELATO_RELAY_ERC2771_ADDRESS,
  GELATO_RELAY_ERC2771_ZKSYNC_ADDRESS,
  GELATO_RELAY_1BALANCE_CONCURRENT_ERC2771_ADDRESS,
  GELATO_RELAY_CONCURRENT_ERC2771_ADDRESS,
  GELATO_RELAY_URL,
  GELATO_RELAY_CONCURRENT_ERC2771_ZKSYNC_ADDRESS,
  GELATO_RELAY_1BALANCE_CONCURRENT_ERC2771_ZKSYNC_ADDRESS,
} from "./constants";
import { WebsocketHandler } from "./utils/index.js";

export {
  CallWithSyncFeeRequest,
  CallWithERC2771Request,
  SponsoredCallRequest,
  RelayRequestOptions,
  TransactionStatusResponse,
  RelayResponse,
  SignatureData,
  PayloadToSign,
  ERC2771Type,
  CallWithSyncFeeERC2771Request,
  BaseCallWithSyncFeeParams,
  CallWithSyncFeeConcurrentERC2771Request,
  CallWithConcurrentERC2771Request,
  Config,
  SignerOrProvider,
  TaskState,
};

export class GelatoRelay {
  #config: Config;
  readonly #websocketHandler: WebsocketHandler;

  constructor(config?: Partial<Config>) {
    this.#config = this._getConfiguration(config);
    this.#websocketHandler = new WebsocketHandler(this.#config.websocketUrl);
  }

  /**
   * @param {Config} config Configuration
   */
  configure = (config: Partial<Config>) => {
    this.#config = this._getConfiguration(config);
  };

  private _getConfiguration = (config?: Partial<Config>): Config => {
    const url = config?.url ?? GELATO_RELAY_URL;
    return {
      url,
      websocketUrl: url.replace(/^http/, "ws"),
      contract: {
        relayERC2771:
          config?.contract?.relayERC2771 ?? GELATO_RELAY_ERC2771_ADDRESS,
        relay1BalanceERC2771:
          config?.contract?.relay1BalanceERC2771 ??
          GELATO_RELAY_1BALANCE_ERC2771_ADDRESS,
        relayERC2771zkSync:
          config?.contract?.relayERC2771zkSync ??
          GELATO_RELAY_ERC2771_ZKSYNC_ADDRESS,
        relay1BalanceERC2771zkSync:
          config?.contract?.relay1BalanceERC2771zkSync ??
          GELATO_RELAY_1BALANCE_ERC2771_ZKSYNC_ADDRESS,
        relayConcurrentERC2771:
          config?.contract?.relayConcurrentERC2771 ??
          GELATO_RELAY_CONCURRENT_ERC2771_ADDRESS,
        relay1BalanceConcurrentERC2771:
          config?.contract?.relay1BalanceConcurrentERC2771 ??
          GELATO_RELAY_1BALANCE_CONCURRENT_ERC2771_ADDRESS,
        relayConcurrentERC2771zkSync:
          config?.contract?.relayConcurrentERC2771zkSync ??
          GELATO_RELAY_CONCURRENT_ERC2771_ZKSYNC_ADDRESS,
        relay1BalanceConcurrentERC2771zkSync:
          config?.contract?.relay1BalanceConcurrentERC2771zkSync ??
          GELATO_RELAY_1BALANCE_CONCURRENT_ERC2771_ZKSYNC_ADDRESS,
      },
    };
  };

  /**
   * @param {CallWithSyncFeeRequest} request - CallWithSyncFee request to be relayed by Gelato Executors
   * @param {RelayRequestOptions} [options] - Optional Relay configuration
   * @param {string} [sponsorApiKey] Optional Sponsor API key to be used for the call
   * @returns {Promise<RelayResponse>} Response object with taskId parameter
   *
   */
  callWithSyncFee = async (
    request: CallWithSyncFeeRequest,
    options?: RelayRequestOptions,
    sponsorApiKey?: string
  ): Promise<RelayResponse> => {
    const response = await library.relayWithSyncFee(
      { request, sponsorApiKey, options },
      this.#config
    );

    if (this.#websocketHandler.hasHandlers()) {
      await this.#websocketHandler.subscribe(response.taskId);
    }

    return response;
  };

  /**
   * @param {CallWithSyncFeeERC2771Request | CallWithSyncFeeConcurrentERC2771Request} request - Call with sync fee: Sequential ERC2771 or Concurrent ERC2771 request to be relayed by Gelato Executors
   * @param {SignerOrProvider} signerOrProvider - BrowserProvider [front-end] or Signer [back-end] to sign the payload
   * @param {RelayRequestOptions} [options] - Optional Relay configuration
   * @param {string} [sponsorApiKey] Optional Sponsor API key to be used for the call
   * @returns {Promise<RelayResponse>} Response object with taskId parameter
   *
   */
  callWithSyncFeeERC2771 = async (
    request:
      | CallWithSyncFeeERC2771Request
      | CallWithSyncFeeConcurrentERC2771Request,
    signerOrProvider: SignerOrProvider,
    options?: RelayRequestOptions,
    sponsorApiKey?: string
  ): Promise<RelayResponse> => {
    const response = await library.relayWithCallWithSyncFeeERC2771(
      {
        request,
        signerOrProvider,
        sponsorApiKey,
        options,
      },
      this.#config
    );

    if (this.#websocketHandler.hasHandlers()) {
      await this.#websocketHandler.subscribe(response.taskId);
    }

    return response;
  };

  /**
   * @param {SponsoredCallRequest} request SponsoredCallRequest to be relayed by the Gelato Executors.
   * @param {string} sponsorApiKey Sponsor API key to be used for the call
   * @param {RelayRequestOptions} [options] Optional Relay configuration
   * @returns {Promise<RelayResponse>} Response object with taskId parameter
   *
   */
  sponsoredCall = async (
    request: SponsoredCallRequest,
    sponsorApiKey: string,
    options?: RelayRequestOptions
  ): Promise<RelayResponse> => {
    const response = await library.relayWithSponsoredCall(
      { request, sponsorApiKey, options },
      this.#config
    );

    if (this.#websocketHandler.hasHandlers()) {
      await this.#websocketHandler.subscribe(response.taskId);
    }

    return response;
  };

  /**
   * @param {CallWithERC2771Request | CallWithConcurrentERC2771Request} request - Sponsored: Sequential ERC2771 or Concurrent ERC2771 request to be relayed by Gelato Executors
   * @param {SignerOrProvider} signerOrProvider - BrowserProvider [front-end] or Signer [back-end] to sign the payload
   * @param {string} sponsorApiKey - Sponsor API key
   * @param {RelayRequestOptions} [options] - Optional Relay configuration
   * @returns {Promise<RelayResponse>} Response object with taskId parameter
   *
   */
  sponsoredCallERC2771 = async (
    request: CallWithERC2771Request | CallWithConcurrentERC2771Request,
    signerOrProvider: SignerOrProvider,
    sponsorApiKey: string,
    options?: RelayRequestOptions
  ): Promise<RelayResponse> => {
    const response = await library.relayWithSponsoredCallERC2771(
      {
        request,
        signerOrProvider,
        sponsorApiKey,
        options,
      },
      this.#config
    );

    if (this.#websocketHandler.hasHandlers()) {
      await this.#websocketHandler.subscribe(response.taskId);
    }

    return response;
  };

  /**
   * @param {CallWithERC2771Request | CallWithConcurrentERC2771Request} request - Sequential ERC2771 or Concurrent ERC2771 request to be relayed by Gelato Executors
   * @param {SignerOrProvider} signerOrProvider - BrowserProvider [front-end] or Signer [back-end] to sign the payload
   * @param {ERC2771Type} type - ERC2771Type.CallWithSyncFee or ERC2771Type.SponsoredCall
   * @returns {Promise<SignatureData>} Response object with struct and signature
   *
   */
  getSignatureDataERC2771 = (
    request: CallWithERC2771Request | CallWithConcurrentERC2771Request,
    signerOrProvider: SignerOrProvider,
    type: ERC2771Type
  ): Promise<SignatureData> =>
    library.getSignatureDataERC2771(
      { request, signerOrProvider, type },
      this.#config
    );

  /**
   * @param {CallWithERC2771Request | CallWithConcurrentERC2771Request} request - Sequential ERC2771 or Concurrent ERC2771 request to be relayed by Gelato Executors
   * @param {SignerOrProvider} [signerOrProvider] - Optional BrowserProvider [front-end] or Signer [back-end] to sign the payload
   * @param {ERC2771Type} type - ERC2771Type.CallWithSyncFee or ERC2771Type.SponsoredCall
   * @returns {Promise<PayloadToSign>} Response object with struct and typed data
   *
   */
  getDataToSignERC2771 = (
    request: CallWithERC2771Request | CallWithConcurrentERC2771Request,
    type: ERC2771Type,
    signerOrProvider?: SignerOrProvider
  ): Promise<PayloadToSign> =>
    library.getDataToSignERC2771(
      { request, signerOrProvider, type },
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
  sponsoredCallERC2771WithSignature = async (
    struct: SignatureData["struct"],
    signature: SignatureData["signature"],
    sponsorApiKey: string,
    options?: RelayRequestOptions
  ): Promise<RelayResponse> => {
    const response = await library.sponsoredCallERC2771WithSignature(
      {
        struct,
        signature,
        sponsorApiKey,
        options,
      },
      this.#config
    );

    if (this.#websocketHandler.hasHandlers()) {
      await this.#websocketHandler.subscribe(response.taskId);
    }

    return response;
  };

  /**
   * @param {SignatureData["struct"]} struct - Struct that can be obtained from getSignatureDataERC2771
   * @param {BaseCallWithSyncFeeParams} syncFeeParams - Call with Sync Fee parameters
   * @param {SignatureData["signature"]} signature - Signature that can be obtained from getSignatureDataERC2771
   * @param {RelayRequestOptions} [options] - Optional Relay configuration
   * @param {string} [sponsorApiKey] Optional Sponsor API key to be used for the call
   * @returns {Promise<RelayResponse>} Response object with taskId parameter
   *
   */
  callWithSyncFeeERC2771WithSignature = async (
    struct: SignatureData["struct"],
    syncFeeParams: BaseCallWithSyncFeeParams,
    signature: SignatureData["signature"],
    options?: RelayRequestOptions,
    sponsorApiKey?: string
  ): Promise<RelayResponse> => {
    const response = await library.callWithSyncFeeERC2771WithSignature(
      {
        struct,
        syncFeeParams,
        signature,
        options,
        sponsorApiKey,
      },
      this.#config
    );

    if (this.#websocketHandler.hasHandlers()) {
      await this.#websocketHandler.subscribe(response.taskId);
    }

    return response;
  };

  /**
   * @param {bigint} chainId - Chain Id
   * @returns {Promise<boolean>} Boolean to demonstrate if Relay V2 is supported on the provided chain
   */
  isNetworkSupported = (chainId: bigint): Promise<boolean> =>
    library.isNetworkSupported({ chainId }, this.#config);

  /**
   * @returns {Promise<string[]>} List of networks where Relay V2 is supported
   */
  getSupportedNetworks = (): Promise<string[]> =>
    library.getSupportedNetworks(this.#config);

  /**
   * @param {bigint} chainId - Chain Id
   * @returns {Promise<boolean>} Boolean to demonstrate if the oracle is active on the provided chain
   */
  isOracleActive = (chainId: bigint): Promise<boolean> =>
    library.isOracleActive({ chainId }, this.#config);

  /**
   * @returns {Promise<string[]>} List of chain ids where the Gelato Oracle is active
   */
  getGelatoOracles = (): Promise<string[]> =>
    library.getGelatoOracles(this.#config);

  /**
   * @param {bigint} chainId - Chain Id
   * @returns {Promise<string[]>} List of all payment tokens on the provided chain
   *
   */
  getPaymentTokens = (chainId: bigint): Promise<string[]> =>
    library.getPaymentTokens({ chainId }, this.#config);

  /**
   * @param {bigint} chainId - Chain Id
   * @param {string} paymentToken - Payment Token
   * @param {bigint} gasLimit - Gas Limit
   * @param {boolean} isHighPriority - Priority Level
   * @param {bigint} [gasLimitL1=BigInt(0)] - Gas Limit for Layer 1
   * @returns {Promise<bigint>} Estimated Fee
   *
   */
  getEstimatedFee = (
    chainId: bigint,
    paymentToken: string,
    gasLimit: bigint,
    isHighPriority: boolean,
    gasLimitL1 = BigInt(0)
  ): Promise<bigint> =>
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

  /**
   * @param {callback} handler - Callback function to be called on every task status update
   *
   */
  onTaskStatusUpdate = (
    handler: (taskStatus: TransactionStatusResponse) => void
  ): void => {
    this.#websocketHandler.onUpdate(handler);
  };

  /**
   * @param {callback} handler - Callback function to be unregistered from task status updates
   *
   */
  offTaskStatusUpdate = (
    handler: (taskStatus: TransactionStatusResponse) => void
  ): void => {
    this.#websocketHandler.offUpdate(handler);
  };

  /**
   * @param {callback} handler - Callback function to be called on error
   *
   */
  onError = (handler: (error: Error) => void): void => {
    this.#websocketHandler.onError(handler);
  };

  /**
   * @param {callback} handler - Callback function to be unregistered as an error handler
   *
   */
  offError = (handler: (error: Error) => void): void => {
    this.#websocketHandler.offError(handler);
  };

  /**
   * @param {string} taskId - Task Id
   *
   */
  subscribeTaskStatusUpdate = async (taskId: string): Promise<void> => {
    await this.#websocketHandler.subscribe(taskId);
  };

  /**
   * @param {string} taskId - Task Id
   *
   */
  unsubscribeTaskStatusUpdate = async (taskId: string): Promise<void> => {
    await this.#websocketHandler.unsubscribe(taskId);
  };
}
