import { PaymentType } from "../../types";
import { UserSponsorAuthCallWith1BalanceRequest } from "../1balance/types";
import { UserSponsorAuthCallWithTransferFromRequest } from "../transferFrom/types";

export type UserSponsorSignatureRequest<T extends PaymentType> =
  T extends PaymentType.OneBalance
    ? UserSponsorAuthCallWith1BalanceRequest
    : T extends PaymentType.TransferFrom
    ? UserSponsorAuthCallWithTransferFromRequest
    : never;
