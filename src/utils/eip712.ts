import { EIP712Domain } from "../lib/types";

export const getEIP712Domain = (
  name: string,
  version: string,
  chainId: number,
  verifyingContract: string
): EIP712Domain => {
  return {
    name,
    version,
    chainId,
    verifyingContract,
  };
};
