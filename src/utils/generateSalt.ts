import { AbiCoder, keccak256 } from "ethers";

export const generateSalt = (): string => {
  const randomSeed = Math.floor(Math.random() * 1000000);
  const dataEncoded = AbiCoder.defaultAbiCoder().encode(
    ["uint256", "uint256"],
    [randomSeed, new Date().getMilliseconds()]
  );
  return keccak256(dataEncoded);
};
