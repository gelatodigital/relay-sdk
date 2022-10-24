import { BigNumberish, BytesLike } from "ethers";

export type CallWithSyncFeeRequest = {
  chainId: BigNumberish;
  target: string;
  data: BytesLike;
  feeToken: string;
  isRelayContext?: boolean;
};
