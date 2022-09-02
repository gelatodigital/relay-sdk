import { ethers } from "ethers";

import { PaymentType, RelayRequestOptions, RelayResponse } from "../types";

import { sponsorAuthCallWith1Balance } from "./1balance";
import { SponsorAuthCallWith1BalanceRequest } from "./1balance/types";
import { SponsorSignatureRequest } from "./types";

/**
 * @function
 * @template PT
 * @extends {PaymentType}
 * @param {SponsorSignatureRequest<PT>} request - Depending on the paymentType, SponsorAuthCallWith1Balance or SponsorAuthCallWithTransferFrom request to be signed by the signer
 * @param {ethers.Wallet} signer - Wallet to sign the payload
 * @param {RelayRequestOptions} [options] - Optional Relay configuration
 * @returns {Promise<RelayResponse>} Response object with taskId parameter
 *
 */
export const relayWithSponsorSignature = async <PT extends PaymentType>(
  request: SponsorSignatureRequest<PT>,
  signer: ethers.Wallet,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  return await sponsorAuthCallWith1Balance(
    request as SponsorAuthCallWith1BalanceRequest,
    signer,
    options
  );
};
