import { getAddress } from "ethers/lib/utils.js";

import { ERC2771Type } from "../lib/erc2771/types/index.js";
import { Config } from "../lib/types/index.js";

export const getGelatoRelayAddress = (
  payload: {
    chainId: number;
    type: ERC2771Type;
  },
  config: Config
): string => {
  const { chainId, type } = payload;
  switch (type) {
    case ERC2771Type.CallWithSyncFee:
      return chainId === 324 || chainId === 280
        ? getAddress(config.contract.relayERC2771zkSync)
        : getAddress(config.contract.relayERC2771);
    case ERC2771Type.SponsoredCall:
      return chainId === 324 || chainId === 280
        ? getAddress(config.contract.relay1BalanceERC2771zkSync)
        : getAddress(config.contract.relay1BalanceERC2771);
    default:
      // eslint-disable-next-line no-case-declarations
      const _exhaustiveCheck: never = type;
      return _exhaustiveCheck;
  }
};
