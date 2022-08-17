import { AsyncPayment, RelaySeparator, SyncPayment } from "../../types";
import { UserAuthCallWith1Balance } from "../1balance/types";
import { UserAuthCallWithTransferFrom } from "../transferFrom/types";

export type UserAuthSignature = {
  userSignature: string;
};

export type RelayRequestWithUserSignature<T extends RelaySeparator> =
  T extends AsyncPayment
    ? UserAuthCallWith1Balance
    : T extends SyncPayment
    ? UserAuthCallWithTransferFrom
    : never;
