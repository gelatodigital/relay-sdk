import { getAddress } from "ethers/lib/utils";

import { RelayAddresses, RELAY_ADDRESSES } from "../constants/address";

export const getRelayAddress = (chainId: number): string => {
  const addresses: RelayAddresses = RELAY_ADDRESSES[chainId];
  if (!addresses || !addresses.relayAddress) {
    throw new Error(`Relay is not supported on chainId [${chainId}]`);
  }
  return getAddress(addresses.relayAddress);
};
