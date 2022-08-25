import { ethers } from "ethers";

import { PaymentType } from "../types";

import { generateUserSponsorSignatureWith1Balance } from "./1balance";
import { UserSponsorAuthCallWith1BalanceRequest } from "./1balance/types";
import { generateUserSponsorSignatureWithTransferFrom } from "./transferFrom";
import { UserSponsorAuthCallWithTransferFromRequest } from "./transferFrom/types";
import { UserSponsorSignatureRequest } from "./types";

/**
 * @function
 * @template PT
 * @extends {PaymentType}
 * @param {PT} paymentType - PaymentType.OneBalance or PaymentType.TransferFrom
 * @param {UserSponsorSignatureRequest<PT>} request - Depending on the paymentType, UserSponsorAuthCallWith1Balance or UserSponsorAuthCallWithTransferFrom request to be signed by the signer
 * @param {ethers.Wallet} signer - Wallet to sign the payload
 * @returns {Promise<string>} signature
 *
 */
export const generateUserSponsorSignature = async <PT extends PaymentType>(
  paymentType: PT,
  request: UserSponsorSignatureRequest<PT>,
  signer: ethers.Wallet
): Promise<string> => {
  switch (paymentType) {
    case PaymentType.OneBalance:
      return generateUserSponsorSignatureWith1Balance(
        request as UserSponsorAuthCallWith1BalanceRequest,
        signer
      );

    case PaymentType.TransferFrom:
      return generateUserSponsorSignatureWithTransferFrom(
        request as UserSponsorAuthCallWithTransferFromRequest,
        signer
      );

    default: {
      const _exhaustiveCheck: never = paymentType;
      return _exhaustiveCheck;
    }
  }
};
