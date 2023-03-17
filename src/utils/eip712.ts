import { getAddress } from "ethers/lib/utils";

import { Config, EIP712Domain } from "../lib/types";

export const getEIP712Domain = (
  payload: { chainId: number },
  config: Config
): EIP712Domain => {
  return {
    name: "GelatoRelayERC2771",
    version: "1",
    chainId: payload.chainId,
    verifyingContract: getAddress(config.contract.relayERC2771),
  };
};
