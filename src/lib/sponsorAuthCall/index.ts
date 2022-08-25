import { ethers } from "ethers";

import { PaymentType } from "../types";

import { generateSponsorSignatureWith1Balance } from "./1balance";
import { SponsorAuthCallWith1BalanceRequest } from "./1balance/types";
import { generateSponsorSignatureWithTransferFrom } from "./transferFrom";
import { SponsorAuthCallWithTransferFromRequest } from "./transferFrom/types";
import { SponsorSignatureRequest } from "./types";

/**
 * @function
 * @template PT
 * @extends {PaymentType}
 * @param {PT} paymentType - PaymentType.OneBalance or PaymentType.TransferFrom
 * @param {SponsorSignatureRequest<PT>} request - Depending on the paymentType, SponsorAuthCallWith1Balance or SponsorAuthCallWithTransferFrom request to be signed by the signer
 * @param {ethers.Wallet} signer - Wallet to sign the payload
 * @returns {Promise<string>} signature
 *
 */
export const generateSponsorSignature = async <PT extends PaymentType>(
  paymentType: PT,
  request: SponsorSignatureRequest<PT>,
  signer: ethers.Wallet
): Promise<string> => {
  switch (paymentType) {
    case PaymentType.OneBalance:
      return generateSponsorSignatureWith1Balance(
        request as SponsorAuthCallWith1BalanceRequest,
        signer
      );

    case PaymentType.TransferFrom:
      return generateSponsorSignatureWithTransferFrom(
        request as SponsorAuthCallWithTransferFromRequest,
        signer
      );

    default: {
      const _exhaustiveCheck: never = paymentType;
      return _exhaustiveCheck;
    }
  }
};
