import { BytesLike } from "ethers";
import { EIP712Domain } from "../../../../types";
import { AsyncPayment, PaymentType, RelaySeparator, SyncPayment } from "../../types";
import { UserAuthCallWith1BalanceRequest } from "../1balance";
import { UserAuthCallWithTransferFromRequest } from "../transferFrom";

export const EIP712UserAuthCallTypeData = {
  UserAuthCall: [
    { name: "chainId", type: "uint256" },
    { name: "target", type: "address" },
    { name: "data", type: "bytes" },
    { name: "user", type: "address" },
    { name: "userNonce", type: "uint256" },
    { name: "userDeadline", type: "uint256" },
    { name: "paymentType", type: "string" },
    { name: "feeToken", type: "address" },
    { name: "oneBalanceChainId", type: "uint256" },
    { name: "maxFee", type: "uint256" },
  ],
};

export type UserAuthCallPayloadToSign<T> = {
  domain: EIP712Domain;
  types: {
    UserAuthCall: {
      name: string;
      type: string;
    }[];
  };
  primaryType: string;
  message: T;
};

export type UserAuthCallRequest = {
  chainId: number;
  target: string;
  data: BytesLike;
  user: string;
  userNonce: number;
  userDeadline: number;
  paymentType: PaymentType;
  feeToken: string;
  oneBalanceChainId: string;
  maxFee: string;
};

//RelayRequestWithUserSignature Types
type UserAuthCallWith1Balance = {
  relaySeparator: AsyncPayment;
  relayData: UserAuthCallWith1BalanceRequest;
};

type UserAuthCallWithTransferFrom = {
  relaySeparator: SyncPayment;
  relayData: UserAuthCallWithTransferFromRequest;
};

export type RelayRequestWithUserSignature<T extends RelaySeparator> =
  T extends AsyncPayment
    ? UserAuthCallWith1Balance
    : T extends SyncPayment
    ? UserAuthCallWithTransferFrom
    : never;