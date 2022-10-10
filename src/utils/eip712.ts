import { GELATO_RELAY_ADDRESS } from "../constants";
import { EIP712Domain, RelayContract } from "../lib/types";

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
        verifyingContract: GELATO_RELAY_ADDRESS,
      };
    default: {
      const _exhaustiveCheck: never = relayContract;
      return _exhaustiveCheck;
    }
  }
};
