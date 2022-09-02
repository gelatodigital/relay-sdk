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
  UserSponsorAuthCallWith1BalanceRequest,
  UserSponsorAuthCallWith1BalanceStruct,
} from "./1balance/types";
import {
  generateUserSponsorSignatureWithTransferFromAndSponsor,
  generateUserSponsorSignatureWithTransferFromAndUser,
} from "./transferFrom";
import {
  UserSponsorAuthCallWithTransferFromRequest,
  UserSponsorAuthCallWithTransferFromStruct,
} from "./transferFrom/types";
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
 * @param {PT} paymentType - PaymentType.OneBalance or PaymentType.TransferFrom
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
  paymentType: PT,
  signerProfile: S,
  request: UserSponsorSignatureRequest<PT, S>,
  signer: Signer<S>
): Promise<SignatureResponse> => {
  switch (paymentType) {
    case PaymentType.OneBalance:
      switch (signerProfile) {
        case SignerProfile.User:
          return await generateUserSponsorSignatureWith1BalanceAndUser(
            request as UserSponsorAuthCallWith1BalanceRequest,
            signer as ethers.providers.Web3Provider
          );
        case SignerProfile.Sponsor:
          return await generateUserSponsorSignatureWith1BalanceAndSponsor(
            request as UserSponsorAuthCallWith1BalanceStruct,
            signer as ethers.Wallet
          );
        default: {
          const _exhaustiveCheck: never = signerProfile;
          return _exhaustiveCheck;
        }
      }
    case PaymentType.TransferFrom:
      switch (signerProfile) {
        case SignerProfile.User:
          return await generateUserSponsorSignatureWithTransferFromAndUser(
            request as UserSponsorAuthCallWithTransferFromRequest,
            signer as ethers.providers.Web3Provider
          );
        case SignerProfile.Sponsor:
          return await generateUserSponsorSignatureWithTransferFromAndSponsor(
            request as UserSponsorAuthCallWithTransferFromStruct,
            signer as ethers.Wallet
          );
        default: {
          const _exhaustiveCheck: never = signerProfile;
          return _exhaustiveCheck;
        }
      }

    default: {
      const _exhaustiveCheck: never = paymentType;
      return _exhaustiveCheck;
    }
  }
};

/**
 * @function
 * @template PT
 * @extends {PaymentType}
 * @param {PT} paymentType - PaymentType.OneBalance or PaymentType.TransferFrom
 * @param {UserSponsorAuthCallStruct<PT>} request - Depending on the paymentType, UserSponsorAuthCallWith1Balance or UserSponsorAuthCallWithTransferFrom struct to be relayed by Gelato Executors
 * @param {string} userSignature - user signature generated via generateUserSponsorSignature
 * @param {string} sponsorSignature - sponsor signature generated via generateUserSponsorSignature
 * @param {RelayRequestOptions} [options] - Optional Relay configuration
 * @returns {Promise<RelayResponse>} Response object with taskId parameter
 *
 */
export const relayWithUserSponsorSignature = async <PT extends PaymentType>(
  paymentType: PT,
  struct: UserSponsorAuthCallStruct<PT>,
  userSignature: string,
  sponsorSignature: string,
  options?: RelayRequestOptions
): Promise<RelayResponse> => {
  try {
    switch (paymentType) {
      case PaymentType.OneBalance:
        return (
          await axios.post(
            `${GELATO_RELAY_URL}/relays/v2/user-sponsor-auth-call`,
            {
              ...(struct as UserSponsorAuthCallWith1BalanceStruct),
              ...options,
              userSignature,
              sponsorSignature,
            }
          )
        ).data;

      case PaymentType.TransferFrom:
        return (
          await axios.post(
            `${GELATO_RELAY_URL}/relays/v2/user-sponsor-auth-call`,
            {
              ...(struct as UserSponsorAuthCallWithTransferFromStruct),
              ...options,
              userSignature,
              sponsorSignature,
            }
          )
        ).data;

      default: {
        const _exhaustiveCheck: never = paymentType;
        return _exhaustiveCheck;
      }
    }
  } catch (error) {
    throw new Error(
      `GelatoRelaySDK/relayWithUserSponsorSignature: Failed with error: ${getHttpErrorMessage(
        error
      )}`
    );
  }
};
