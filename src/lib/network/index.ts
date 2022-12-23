import axios from "axios";

import { GELATO_RELAY_URL } from "../../constants";
import { getHttpErrorMessage } from "../../utils";

export const isNetworkSupported = async (chainId: number): Promise<boolean> => {
  const supportedNetworks = await getSupportedNetworks();
  return supportedNetworks.includes(chainId.toString());
};

export const getSupportedNetworks = async (): Promise<string[]> => {
  try {
    return (
      await axios.get<{ relays: string[] }>(`${GELATO_RELAY_URL}/relays/v2`)
    ).data.relays;
  } catch (error) {
    throw new Error(
      `GelatoRelaySDK/getSupportedNetworks: Failed with error: ${getHttpErrorMessage(
        error
      )}`
    );
  }
};
