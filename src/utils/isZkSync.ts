export const isZkSync = (chainId: bigint): boolean => {
  return chainId === BigInt(324) || chainId === BigInt(280);
};
