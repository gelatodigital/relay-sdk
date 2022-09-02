import { PaymentType } from "../../types";
import { SponsorAuthCallWith1BalanceRequest } from "../1balance/types";

export type SponsorAuthSignature = {
  sponsorSignature: string;
};

export type SponsorSignatureRequest<T extends PaymentType> =
  T extends PaymentType.OneBalance ? SponsorAuthCallWith1BalanceRequest : never;
