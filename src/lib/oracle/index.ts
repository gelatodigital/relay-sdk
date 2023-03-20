import axios from "axios";
import { BigNumber } from "ethers";

import { getHttpErrorMessage } from "../../utils";
import { Config } from "../types";

export const isOracleActive = async (
  payload: {
    chainId: number;
  },
  config: Config
): Promise<boolean> => {
  const oracles = await getGelatoOracles(config);
  return oracles.includes(payload.chainId.toString());
};

export const getGelatoOracles = async (config: Config): Promise<string[]> => {
  try {
    return (await axios.get(`${config.url}/oracles/`)).data.oracles;
  } catch (error) {
    throw new Error(
      `GelatoRelaySDK/getGelatoOracles: Failed with error: ${getHttpErrorMessage(
        error
      )}`
    );
  }
};

export const getPaymentTokens = async (
  payload: { chainId: number },
  config: Config
): Promise<string[]> => {
  try {
    return (
      await axios.get(`${config.url}/oracles/${payload.chainId}/paymentTokens/`)
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
  payload: {
    chainId: number;
    paymentToken: string;
    gasLimit: BigNumber;
    isHighPriority: boolean;
    gasLimitL1: BigNumber;
  },
  config: Config
): Promise<BigNumber> => {
  const { chainId, gasLimit, gasLimitL1, isHighPriority, paymentToken } =
    payload;
  const params = {
    paymentToken,
    gasLimit: gasLimit.toString(),
    isHighPriority,
    gasLimitL1: gasLimitL1.toString(),
  };
  try {
    const res = await axios.get(`${config.url}/oracles/${chainId}/estimate`, {
      params,
    });
    return BigNumber.from(res.data.estimatedFee);
  } catch (error) {
    throw new Error(
      `GelatoRelaySDK/getEstimatedFee: Failed with error: ${getHttpErrorMessage(
        error
      )}`
    );
  }
};
