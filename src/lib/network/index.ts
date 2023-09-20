import { axiosInstance, getHttpErrorMessage } from "../../utils";
import { Config } from "../types";

export const isNetworkSupported = async (
  payload: {
    chainId: bigint;
  },
  config: Config
): Promise<boolean> => {
  const supportedNetworks = await getSupportedNetworks(config);
  return supportedNetworks.includes(payload.chainId.toString());
};

export const getSupportedNetworks = async (
  config: Config
): Promise<string[]> => {
  try {
    return (
      await axiosInstance.get<{ relays: string[] }>(`${config.url}/relays/v2`)
    ).data.relays;
  } catch (error) {
    throw new Error(
      `GelatoRelaySDK/getSupportedNetworks: Failed with error: ${getHttpErrorMessage(
        error
      )}`
    );
  }
};
