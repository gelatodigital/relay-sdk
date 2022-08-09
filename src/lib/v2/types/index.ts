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
  SyncFee,
  OneBalance,
  TransferFrom,
}