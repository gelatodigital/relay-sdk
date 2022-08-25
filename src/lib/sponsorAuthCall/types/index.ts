import { PaymentType } from "../../types";
import { SponsorAuthCallWith1BalanceRequest } from "../1balance/types";
import { SponsorAuthCallWithTransferFromRequest } from "../transferFrom/types";

export type SponsorSignatureRequest<T extends PaymentType> =
  T extends PaymentType.OneBalance
    ? SponsorAuthCallWith1BalanceRequest
    : T extends PaymentType.TransferFrom
    ? SponsorAuthCallWithTransferFromRequest
    : never;
