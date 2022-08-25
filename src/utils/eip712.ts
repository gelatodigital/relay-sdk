import { getRelayAddress, getRelayWithTransferFromAddress } from "../constants";
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
        verifyingContract: getRelayAddress(chainId),
      };
    case RelayContract.GelatoRelayWithTransferFrom:
      return {
        name: "GelatoRelayWithTransferFrom",
        version: "1",
        chainId,
        verifyingContract: getRelayWithTransferFromAddress(chainId),
      };
    default: {
      const _exhaustiveCheck: never = relayContract;
      return _exhaustiveCheck;
    }
  }
};
