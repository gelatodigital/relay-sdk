const RELAY_V2_ENABLED_CHAINS = {
  MUMBAI: 80_001,
  GOERLI: 5,
  ARBITRUM_GOERLI: 421_613,
  RINKEBY: 4,
  CELO_ALFAJORES: 44_787,
  POLYGON: 137,
  OPTIMISM_GOERLI: 420,
} as const;

type RelayV2EnabledChains =
  typeof RELAY_V2_ENABLED_CHAINS[keyof typeof RELAY_V2_ENABLED_CHAINS];

export type RelayAddresses = {
  relayAddress: string | null;
};

export const RELAY_ADDRESSES: {
  [key in RelayV2EnabledChains]: RelayAddresses;
} = {
  80_001: {
    relayAddress: "0xaBcC9b596420A9E9172FD5938620E265a0f9Df92",
  },
  5: {
    relayAddress: "0xaBcC9b596420A9E9172FD5938620E265a0f9Df92",
  },
  421_613: {
    relayAddress: "0xaBcC9b596420A9E9172FD5938620E265a0f9Df92",
  },
  4: {
    relayAddress: "0xaBcC9b596420A9E9172FD5938620E265a0f9Df92",
  },
  44_787: {
    relayAddress: "0xaBcC9b596420A9E9172FD5938620E265a0f9Df92",
  },
  137: {
    relayAddress: "0xaBcC9b596420A9E9172FD5938620E265a0f9Df92",
  },
  420: {
    relayAddress: "0xaBcC9b596420A9E9172FD5938620E265a0f9Df92",
  },
};
