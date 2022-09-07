import { BigNumberish, BytesLike } from "ethers";

export type SponsoredCallStruct = {
  chainId: BigNumberish;
  target: string;
  data: BytesLike;
};

export type SponsoredCallRequest = SponsoredCallStruct;
