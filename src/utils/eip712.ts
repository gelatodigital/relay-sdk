import { GELATO_RELAY_ERC2771_ADDRESS } from "../constants";
import { EIP712Domain } from "../lib/types";

export const getEIP712Domain = (chainId: number): EIP712Domain => {
  return {
    name: "GelatoRelayERC2771",
    version: "1",
    chainId,
    verifyingContract: GELATO_RELAY_ERC2771_ADDRESS,
  };
};
