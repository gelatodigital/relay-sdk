const RELAY_V2_ENABLED_CHAINS = {
  MUMBAI: 80_001,
  GOERLI: 5,
  ARBITRUM_GOERLI: 421_613,
} as const;

type RelayV2EnabledChains =
  typeof RELAY_V2_ENABLED_CHAINS[keyof typeof RELAY_V2_ENABLED_CHAINS];

export type RelayAddresses = {
  relayAddress: string | null;
  relayWithTransferFromAddress: string | null;
};

export const RELAY_ADDRESSES: {
  [key in RelayV2EnabledChains]: RelayAddresses;
} = {
  80_001: {
    relayAddress: "0xaBcC9b596420A9E9172FD5938620E265a0f9Df92",
    relayWithTransferFromAddress: null,
  },
  5: {
    relayAddress: "0xaBcC9b596420A9E9172FD5938620E265a0f9Df92",
    relayWithTransferFromAddress: null,
  },
  421_613: {
    relayAddress: "0xaBcC9b596420A9E9172FD5938620E265a0f9Df92",
    relayWithTransferFromAddress: null,
  },
};
