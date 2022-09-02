import { EIP712Domain, RelayContract } from "../lib/types";

import { getRelayAddress } from "./getRelayAddresses";

export const getEIP712Domain = (
  chainId: number,
  relayContract: RelayContract
): EIP712Domain => {
  switch (relayContract) {
    case RelayContract.GelatoRelay:
      return {
        name: "GelatoRelay",
        version: "1",
        chainId,
        verifyingContract: getRelayAddress(chainId),
      };
    default: {
      const _exhaustiveCheck: never = relayContract;
      return _exhaustiveCheck;
    }
  }
};
