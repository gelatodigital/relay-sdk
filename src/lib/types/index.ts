import { BigNumberish } from "ethers";

export enum RelayContract {
  GelatoRelay = "GelatoRelay",
}

export enum RelayCall {
  Sponsored,
  SponsoredUserAuth,
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
