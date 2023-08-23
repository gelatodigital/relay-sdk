import { ethers } from "ethers";

export const generateSalt = (): string => {
  const randomSeed = Math.floor(Math.random() * 1000000);
  const dataEncoded = ethers.AbiCoder.defaultAbiCoder().encode(
    ["uint256", "uint256"],
    [randomSeed, new Date().getMilliseconds()]
  );
  return ethers.keccak256(dataEncoded);
};
