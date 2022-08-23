import {
  OneBalancePayment,
  RelaySeparator,
  TransferFromPayment,
} from "../../types";
import { UserAuthCallWith1Balance } from "../1balance/types";
import { UserAuthCallWithTransferFrom } from "../transferFrom/types";

export type UserAuthSignature = {
  userSignature: string;
};

export type RelayRequestWithUserSignature<T extends RelaySeparator> =
  T extends OneBalancePayment
    ? UserAuthCallWith1Balance
    : T extends TransferFromPayment
    ? UserAuthCallWithTransferFrom
    : never;
