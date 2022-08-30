import { BigNumber } from "ethers";

export const calculateDeadline = (gap: number) => {
  return BigNumber.from(Math.floor(Date.now() / 1000) + gap).toString();
};
