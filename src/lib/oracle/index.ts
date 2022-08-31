import axios from "axios";
import { BigNumber } from "ethers";

import { GELATO_RELAY_URL } from "../../constants";
import { getHttpErrorMessage } from "../../utils";

/**
 * @param {number} chainId - Chain Id
 * @returns {Promise<boolean>} Boolean to demonstrate if the oracle is active on the provided chain
 *
 */
export const isOracleActive = async (chainId: number): Promise<boolean> => {
  const oracles = await getGelatoOracles();
  return oracles.includes(chainId.toString());
};

/**
 * @returns {Promise<string[]>} List of chain ids where the Gelato Oracle is active
 *
 */
export const getGelatoOracles = async (): Promise<string[]> => {
  try {
    return (await axios.get(`${GELATO_RELAY_URL}/oracles/`)).data.oracles;
  } catch (error) {
    throw new Error(
      `GelatoRelaySDK/getGelatoOracles: Failed with error: ${getHttpErrorMessage(
        error
      )}`
    );
  }
};

/**
 * @param {number} chainId - Chain Id
 * @returns {Promise<string[]>} List of all payment tokens on the provided chain
 *
 */
export const getPaymentTokens = async (chainId: number): Promise<string[]> => {
  try {
    return (
      await axios.get(`${GELATO_RELAY_URL}/oracles/${chainId}/paymentTokens/`)
    ).data.paymentTokens;
  } catch (error) {
    throw new Error(
      `GelatoRelaySDK/getPaymentTokens: Failed with error: ${getHttpErrorMessage(
        error
      )}`
    );
  }
};

/**
 * @param {number} chainId - Chain Id
 * @param {string} paymentToken - Payment Token
 * @param {BigNumber} gasLimit - Gas Limit
 * @param {boolean} isHighPriority - Priority Level
 * @param {BigNumber} [gasLimitL1=BigNumber.from(0)] - Gas Limit for Layer 1
 * @returns {Promise<BigNumber>} Estimated Fee
 *
 */
export const getEstimatedFee = async (
  chainId: number,
  paymentToken: string,
  gasLimit: BigNumber,
  isHighPriority: boolean,
  gasLimitL1 = BigNumber.from(0)
): Promise<BigNumber> => {
  const params = {
    paymentToken,
    gasLimit: gasLimit.toString(),
    isHighPriority,
    gasLimitL1: gasLimitL1.toString(),
  };
  try {
    const res = await axios.get(
      `${GELATO_RELAY_URL}/oracles/${chainId}/estimate`,
      {
        params,
      }
    );
    return BigNumber.from(res.data.estimatedFee);
  } catch (error) {
    throw new Error(
      `GelatoRelaySDK/getEstimatedFee: Failed with error: ${getHttpErrorMessage(
        error
      )}`
    );
  }
};
