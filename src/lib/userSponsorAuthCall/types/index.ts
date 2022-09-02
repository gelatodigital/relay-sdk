import { ethers } from "ethers";

import { PaymentType, SignerProfile } from "../../types";
import {
  UserSponsorAuthCallWith1BalanceRequest,
  UserSponsorAuthCallWith1BalanceStruct,
} from "../1balance/types";

export type UserSponsorSignatureRequest<
  PT extends PaymentType,
  S extends SignerProfile
> = PT extends PaymentType.OneBalance
  ? UserSponsorAuthCallWith1BalanceSignatureRequest<S>
  : never;

export type UserSponsorAuthCallWith1BalanceSignatureRequest<
  S extends SignerProfile
> = S extends SignerProfile.User
  ? UserSponsorAuthCallWith1BalanceRequest
  : S extends SignerProfile.Sponsor
  ? UserSponsorAuthCallWith1BalanceStruct
  : never;

export type UserSponsorAuthCallStruct<PT extends PaymentType> =
  PT extends PaymentType.OneBalance
    ? UserSponsorAuthCallWith1BalanceStruct
    : never;

export type Signer<S extends SignerProfile> = S extends SignerProfile.User
  ? ethers.providers.Web3Provider
  : S extends SignerProfile.Sponsor
  ? ethers.Wallet
  : never;

export type SignatureResponse = {
  signature: string;
  struct: UserSponsorAuthCallWith1BalanceStruct;
};
