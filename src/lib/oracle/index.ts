import { axiosInstance, getHttpErrorMessage } from "../../utils";
import { Config } from "../types";

export const isOracleActive = async (
  payload: {
    chainId: bigint;
  },
  config: Config
): Promise<boolean> => {
  const oracles = await getGelatoOracles(config);
  return oracles.includes(payload.chainId.toString());
};

export const getGelatoOracles = async (config: Config): Promise<string[]> => {
  try {
    return (await axiosInstance.get(`${config.url}/oracles/`)).data.oracles;
  } catch (error) {
    throw new Error(
      `GelatoRelaySDK/getGelatoOracles: Failed with error: ${getHttpErrorMessage(
        error
      )}`
    );
  }
};

export const getPaymentTokens = async (
  payload: { chainId: bigint },
  config: Config
): Promise<string[]> => {
  try {
    return (
      await axiosInstance.get(
        `${config.url}/oracles/${payload.chainId.toString()}/paymentTokens/`
      )
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
    chainId: bigint;
    paymentToken: string;
    gasLimit: bigint;
    isHighPriority: boolean;
    gasLimitL1: bigint;
  },
  config: Config
): Promise<bigint> => {
  const { chainId, gasLimit, gasLimitL1, isHighPriority, paymentToken } =
    payload;
  const params = {
    paymentToken,
    gasLimit: gasLimit.toString(),
    isHighPriority,
    gasLimitL1: gasLimitL1.toString(),
  };
  try {
    const res = await axiosInstance.get(
      `${config.url}/oracles/${chainId.toString()}/estimate`,
      {
        params,
      }
    );
    return BigInt(res.data.estimatedFee);
  } catch (error) {
    throw new Error(
      `GelatoRelaySDK/getEstimatedFee: Failed with error: ${getHttpErrorMessage(
        error
      )}`
    );
  }
};
