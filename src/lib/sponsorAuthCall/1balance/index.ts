import { ethers } from "ethers";
import { getAddress } from "ethers/lib/utils";

import { getEIP712Domain } from "../../../utils";
import { PaymentType, RelayContract } from "../../types";
import { getFeeToken } from "../../../utils/getFeeToken";

import {
  EIP712_SPONSOR_AUTH_CALL_WITH_1BALANCE_TYPE_DATA,
  SponsorAuthCallWith1BalanceRequest,
  SponsorAuthCallWith1BalanceStruct,
} from "./types";

const mapRequestToStruct = async (
  request: SponsorAuthCallWith1BalanceRequest
): Promise<SponsorAuthCallWith1BalanceStruct> => {
  return {
    chainId: request.chainId,
    target: getAddress(request.target as string),
    data: request.data,
    sponsor: getAddress(request.sponsor as string),
    sponsorSalt: request.sponsorSalt,
    paymentType: PaymentType.OneBalance,
    feeToken: getAddress(
      await getFeeToken(request.chainId as number, request.sponsor as string)
    ),
    oneBalanceChainId: request.oneBalanceChainId,
  };
};

export const generateSponsorSignatureWith1Balance = async (
  request: SponsorAuthCallWith1BalanceRequest,
  signer: ethers.Wallet
): Promise<string> => {
  try {
    const struct = await mapRequestToStruct(request);
    const domain = getEIP712Domain(
      request.chainId as number,
      RelayContract.GelatoRelay
    );
    return await signer._signTypedData(
      domain,
      EIP712_SPONSOR_AUTH_CALL_WITH_1BALANCE_TYPE_DATA,
      struct
    );
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/generateSponsorSignature/1balance: Failed with error: ${errorMessage}`
    );
  }
};
