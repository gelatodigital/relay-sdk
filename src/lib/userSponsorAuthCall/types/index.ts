import { ethers } from "ethers";

import { PaymentType, SignerProfile } from "../../types";
import {
  UserSponsorAuthCallWith1BalanceRequest,
  UserSponsorAuthCallWith1BalanceStruct,
} from "../1balance/types";
import {
  UserSponsorAuthCallWithTransferFromRequest,
  UserSponsorAuthCallWithTransferFromStruct,
} from "../transferFrom/types";

export type UserSponsorSignatureRequest<
  PT extends PaymentType,
  S extends SignerProfile
> = PT extends PaymentType.OneBalance
  ? UserSponsorAuthCallWith1BalanceSignatureRequest<S>
  : PT extends PaymentType.TransferFrom
  ? UserSponsorAuthCallWithTransferFromSignatureRequest<S>
  : never;

export type UserSponsorAuthCallWith1BalanceSignatureRequest<
  S extends SignerProfile
> = S extends SignerProfile.User
  ? UserSponsorAuthCallWith1BalanceRequest
  : S extends SignerProfile.Sponsor
  ? UserSponsorAuthCallWith1BalanceStruct
  : never;

export type UserSponsorAuthCallWithTransferFromSignatureRequest<
  S extends SignerProfile
> = S extends SignerProfile.User
  ? UserSponsorAuthCallWithTransferFromRequest
  : S extends SignerProfile.Sponsor
  ? UserSponsorAuthCallWithTransferFromStruct
  : never;

export type UserSponsorAuthCallStruct<PT extends PaymentType> =
  PT extends PaymentType.OneBalance
    ? UserSponsorAuthCallWith1BalanceStruct
    : PT extends PaymentType.TransferFrom
    ? UserSponsorAuthCallWithTransferFromStruct
    : never;

export type Signer<S extends SignerProfile> = S extends SignerProfile.User
  ? ethers.providers.Web3Provider
  : S extends SignerProfile.Sponsor
  ? ethers.Wallet
  : never;

export type SignatureResponse = {
  signature: string;
  struct:
    | UserSponsorAuthCallWith1BalanceStruct
    | UserSponsorAuthCallWithTransferFromStruct;
};
