import { PaymentType } from "../../types";
import { SponsoredCallWith1BalanceRequest } from "../1balance/types";

export type SponsoredCallRequest<T extends PaymentType> =
  T extends PaymentType.OneBalance ? SponsoredCallWith1BalanceRequest : never;
