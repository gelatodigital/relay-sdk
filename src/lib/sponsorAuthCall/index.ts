import { ethers } from "ethers";

import { PaymentType, RelayRequestOptions, RelayResponse } from "../types";

import { sponsorAuthCallWith1Balance } from "./1balance";
import { SponsorAuthCallWith1BalanceRequest } from "./1balance/types";
import { sponsorAuthCallWithTransferFrom } from "./transferFrom";
import { SponsorAuthCallWithTransferFromRequest } from "./transferFrom/types";
import { SponsorSignatureRequest } from "./types";

/**
 * @function
 * @template PT
 * @extends {PaymentType}
 * @param {PT} paymentType - PaymentType.OneBalance or PaymentType.TransferFrom
 * @param {SponsorSignatureRequest<PT>} request - Depending on the paymentType, SponsorAuthCallWith1Balance or SponsorAuthCallWithTransferFrom request to be signed by the signer
 * @param {ethers.Wallet} signer - Wallet to sign the payload
 * @param {RelayRequestOptions} [options] - Optional Relay configuration
 * @returns {Promise<RelayResponse>} Response object with taskId parameter
 *
 */
export const relayWithSponsorSignature = async <PT extends PaymentType>(
  paymentType: PT,
  request: SponsorSignatureRequest<PT>,
  signer: ethers.Wallet,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  switch (paymentType) {
    case PaymentType.OneBalance:
      return await sponsorAuthCallWith1Balance(
        request as SponsorAuthCallWith1BalanceRequest,
        signer,
        options
      );

    case PaymentType.TransferFrom:
      return await sponsorAuthCallWithTransferFrom(
        request as SponsorAuthCallWithTransferFromRequest,
        signer,
        options
      );

    default: {
      const _exhaustiveCheck: never = paymentType;
      return _exhaustiveCheck;
    }
  }
};
