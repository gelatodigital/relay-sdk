import axios from "axios";

import { GELATO_RELAY_URL } from "../../constants";
import { getHttpErrorMessage } from "../../utils";

/**
 * @param {number} chainId - Chain Id
 * @returns {Promise<boolean>} Boolean to demonstrate if Relay V2 is supported on the provided chain
 *
 */
export const isNetworkSupported = async (chainId: number): Promise<boolean> => {
  const supportedNetworks = await getSupportedNetworks();
  return supportedNetworks.includes(chainId.toString());
};

/**
 * @returns {Promise<string[]>} List of networks where Relay V2 is supported
 *
 */
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
