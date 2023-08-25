import { Config, EIP712Domain } from "../lib/types";
import { ERC2771Type } from "../lib/erc2771/types";

import { getGelatoRelayERC2771Address } from "./relayAddress";

export const getEIP712Domain = (
  payload: {
    chainId: bigint;
    type: ERC2771Type;
  },
  config: Config
): EIP712Domain => {
  const { chainId, type } = payload;
  switch (type) {
    case ERC2771Type.CallWithSyncFee:
      return {
        name: "GelatoRelayERC2771",
        version: "1",
        chainId: chainId.toString(),
        verifyingContract: getGelatoRelayERC2771Address(
          { chainId, type },
          config
        ),
      };
    case ERC2771Type.SponsoredCall:
      return {
        name: "GelatoRelay1BalanceERC2771",
        version: "1",
        chainId: chainId.toString(),
        verifyingContract: getGelatoRelayERC2771Address(
          { chainId, type },
          config
        ),
      };
    case ERC2771Type.ConcurrentCallWithSyncFee:
      return {
        name: "GelatoRelayConcurrentERC2771",
        version: "1",
        chainId: chainId.toString(),
        verifyingContract: getGelatoRelayERC2771Address(
          { chainId, type },
          config
        ),
      };
    case ERC2771Type.ConcurrentSponsoredCall:
      return {
        name: "GelatoRelay1BalanceConcurrentERC2771",
        version: "1",
        chainId: chainId.toString(),
        verifyingContract: getGelatoRelayERC2771Address(
          { chainId, type },
          config
        ),
      };
    default:
      // eslint-disable-next-line no-case-declarations
      const _exhaustiveCheck: never = type;
      return _exhaustiveCheck;
  }
};
