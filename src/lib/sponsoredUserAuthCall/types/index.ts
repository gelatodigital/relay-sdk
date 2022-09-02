import { ethers } from "ethers";

import { PaymentType, SignerProfile } from "../../types";
import {
  SponsoredUserAuthCallRequest,
  SponsoredUserAuthCallStruct,
} from "../1balance/types";

export type UserSponsorSignatureRequest<
  PT extends PaymentType,
  S extends SignerProfile
> = PT extends PaymentType.OneBalance
  ? SponsoredUserAuthCallSignatureRequest<S>
  : never;

export type SponsoredUserAuthCallSignatureRequest<S extends SignerProfile> =
  S extends SignerProfile.User
    ? SponsoredUserAuthCallRequest
    : S extends SignerProfile.Sponsor
    ? SponsoredUserAuthCallStruct
    : never;

export type UserSponsorAuthCallStruct<PT extends PaymentType> =
  PT extends PaymentType.OneBalance ? SponsoredUserAuthCallStruct : never;

export type Signer<S extends SignerProfile> = S extends SignerProfile.User
  ? ethers.providers.Web3Provider
  : S extends SignerProfile.Sponsor
  ? ethers.Wallet
  : never;

export type SignatureResponse = {
  signature: string;
  struct: SponsoredUserAuthCallStruct;
};
