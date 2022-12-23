import axios from "axios";
import { BigNumber } from "ethers";

import { GELATO_RELAY_URL } from "../../constants";
import { getHttpErrorMessage } from "../../utils";

export const isOracleActive = async (chainId: number): Promise<boolean> => {
  const oracles = await getGelatoOracles();
  return oracles.includes(chainId.toString());
};

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
