import { BigNumberish } from "ethers";

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export enum PaymentType {
  OneBalance = 0,
  TransferFrom = 1,
}

export type OneBalancePayment = {
  paymentType: PaymentType.OneBalance;
};
export type TransferFromPayment = {
  paymentType: PaymentType.TransferFrom;
};

export type RelayRequestOptions = {
  gasLimit?: BigNumberish;
  retries?: number;
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