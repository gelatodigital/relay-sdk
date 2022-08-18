import { BigNumberish } from "ethers";

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export enum PaymentMethod {
  Async,
  Sync,
}

export type RelaySeparator = {
  paymentMethod: PaymentMethod;
};

// RequestSeparator types
export type AsyncPayment = {
  paymentMethod: PaymentMethod.Async;
};
export type SyncPayment = {
  paymentMethod: PaymentMethod.Sync;
};

export enum PaymentType {
  OneBalance,
  TransferFrom,
}

export type PromiseOrValue<T> = T | Promise<T>;

export type RelayRequestOptions = {
  gasLimit?: BigNumberish;
  retries?: number;
};
