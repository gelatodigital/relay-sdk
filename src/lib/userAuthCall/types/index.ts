import { PaymentType } from "../../types";
import { UserAuthCallWith1BalanceRequest } from "../1balance/types";
import { UserAuthCallWithTransferFromRequest } from "../transferFrom/types";

export type UserAuthSignature = {
  userSignature: string;
};

export type RelayRequestWithUserSignature<T extends PaymentType> =
  T extends PaymentType.OneBalance
    ? UserAuthCallWith1BalanceRequest
    : T extends PaymentType.TransferFrom
    ? UserAuthCallWithTransferFromRequest
    : never;
