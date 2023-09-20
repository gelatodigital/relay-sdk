import { getAddress } from "ethers";

import { ERC2771Type } from "../lib/erc2771/types";
import { Config } from "../lib/types";

import { isZkSync } from "./isZkSync";

export const getGelatoRelayERC2771Address = (
  payload: {
    chainId: bigint;
    type: ERC2771Type;
  },
  config: Config
): string => {
  const { chainId, type } = payload;
  switch (type) {
    case ERC2771Type.CallWithSyncFee:
      return isZkSync(chainId)
        ? getAddress(config.contract.relayERC2771zkSync)
        : getAddress(config.contract.relayERC2771);
    case ERC2771Type.SponsoredCall:
      return isZkSync(chainId)
        ? getAddress(config.contract.relay1BalanceERC2771zkSync)
        : getAddress(config.contract.relay1BalanceERC2771);
    case ERC2771Type.ConcurrentCallWithSyncFee:
      return isZkSync(chainId)
        ? getAddress(config.contract.relayConcurrentERC2771zkSync)
        : getAddress(config.contract.relayConcurrentERC2771);
    case ERC2771Type.ConcurrentSponsoredCall:
      return isZkSync(chainId)
        ? getAddress(config.contract.relay1BalanceConcurrentERC2771zkSync)
        : getAddress(config.contract.relay1BalanceConcurrentERC2771);
    default:
      // eslint-disable-next-line no-case-declarations
      const _exhaustiveCheck: never = type;
      return _exhaustiveCheck;
  }
};
