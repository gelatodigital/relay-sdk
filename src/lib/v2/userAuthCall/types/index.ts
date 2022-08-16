import { EIP712Domain } from "../../../../types";
import { AsyncPayment, RelaySeparator, SyncPayment } from "../../types";
import { UserAuthCallWith1Balance } from "../1balance/types";
import { UserAuthCallWithTransferFrom } from "../transferFrom/types";

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

export type UserAuthSignature = {
  userSignature: string;
};

export type RelayRequestWithUserSignature<T extends RelaySeparator> =
  T extends AsyncPayment
    ? UserAuthCallWith1Balance
    : T extends SyncPayment
    ? UserAuthCallWithTransferFrom
    : never;
