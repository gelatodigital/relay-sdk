import axios from "axios";
import { ethers } from "ethers";

import { GELATO_RELAY_URL } from "../../constants";
import { getHttpErrorMessage } from "../../utils";
import {
  PaymentType,
  RelayRequestOptions,
  RelayResponse,
  SignerProfile,
} from "../types";

import {
  generateUserSponsorSignatureWith1BalanceAndSponsor,
  generateUserSponsorSignatureWith1BalanceAndUser,
} from "./1balance";
import {
  SponsoredUserAuthCallRequest,
  SponsoredUserAuthCallStruct,
} from "./1balance/types";
import {
  SignatureResponse,
  Signer,
  UserSponsorAuthCallStruct,
  UserSponsorSignatureRequest,
} from "./types";

/**
 * @function
 * @template PT
 * @extends {PaymentType}
 * @template S
 * @extends {SignerProfile}
 * @param {S} signerProfile - SignerProfile.User or SignerProfile.Sponsor
 * @param {UserSponsorSignatureRequest<PT, S>} request - Depending on the paymentType and signerProfile, the request to be signed by the signer
 * @param {Signer<S>} signer - Depending on the signerProfile, Wallet or Web3Provider to sign the payload
 * @returns {Promise<SignatureResponse>} Response body with signature and signed struct
 *
 */
export const generateUserSponsorSignature = async <
  PT extends PaymentType,
  S extends SignerProfile
>(
  signerProfile: S,
  request: UserSponsorSignatureRequest<PT, S>,
  signer: Signer<S>
): Promise<SignatureResponse> => {
  switch (signerProfile) {
    case SignerProfile.User:
      return await generateUserSponsorSignatureWith1BalanceAndUser(
        request as SponsoredUserAuthCallRequest,
        signer as ethers.providers.Web3Provider
      );
    case SignerProfile.Sponsor:
      return await generateUserSponsorSignatureWith1BalanceAndSponsor(
        request as SponsoredUserAuthCallStruct,
        signer as ethers.Wallet
      );
    default: {
      const _exhaustiveCheck: never = signerProfile;
      return _exhaustiveCheck;
    }
  }
};

/**
 * @function
 * @template PT
 * @extends {PaymentType}
 * @param {PT} paymentType - PaymentType.OneBalance
 * @param {UserSponsorAuthCallStruct<PT>} request - SponsoredUserAuthCall struct to be relayed by Gelato Executors
 * @param {string} userSignature - user signature generated via generateUserSponsorSignature
 * @param {RelayRequestOptions} [options] - Optional Relay configuration
 * @returns {Promise<RelayResponse>} Response object with taskId parameter
 *
 */
export const relayWithSponsoredUserSignature = async <PT extends PaymentType>(
  struct: UserSponsorAuthCallStruct<PT>,
  userSignature: string,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  try {
    return (
      await axios.post(
        `${GELATO_RELAY_URL}/relays/v2/sponsored-user-auth-call`,
        {
          ...(struct as SponsoredUserAuthCallStruct),
          ...options,
          userSignature,
          //TODO: Add sponsorApiKey
        }
      )
    ).data;
  } catch (error) {
    throw new Error(
      `GelatoRelaySDK/relayWithUserSponsorSignature: Failed with error: ${getHttpErrorMessage(
        error
      )}`
    );
  }
};
