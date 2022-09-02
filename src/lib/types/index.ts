import { BigNumberish } from "ethers";

export enum RelayContract {
  GelatoRelay = "GelatoRelay",
}

export enum AuthCall {
  User,
  Sponsor,
  UserSponsor,
}

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export enum PaymentType {
  OneBalance = 0,
}

export enum SignerProfile {
  User,
  Sponsor,
}

export type OneBalancePayment = {
  paymentType: PaymentType.OneBalance;
};

export type RelayRequestOptions = {
  gasLimit?: BigNumberish;
  retries?: number;
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
