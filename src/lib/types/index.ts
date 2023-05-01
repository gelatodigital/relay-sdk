import { BigNumberish, BytesLike } from "ethers";

export enum RelayCall {
  CallWithSyncFee,
  CallWithSyncFeeERC2771,
  SponsoredCall,
  SponsoredCallERC2771,
}

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type RelayRequestOptions = {
  gasLimit?: BigNumberish;
  retries?: number;
};

export type ApiKey = {
  sponsorApiKey: string;
};

export type RelayResponse = {
  taskId: string;
};

export type EIP712Domain = {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
};

export const EIP712_DOMAIN_TYPE_DATA = {
  EIP712Domain: [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
  ],
};

export type BaseRelayParams = {
  chainId: BigNumberish;
  target: string;
  data: BytesLike;
};

export type BaseCallWithSyncFeeParams = {
  feeToken: string;
  isRelayContext?: boolean;
};

export type Config = {
  url: string;
  contract: {
    relayERC2771: string;
    relay1BalanceERC2771: string;
    relayERC2771zkSync: string;
    relay1BalanceERC2771zkSync: string;
  };
};
