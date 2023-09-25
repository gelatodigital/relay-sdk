import { DEFAULT_DEADLINE_GAP } from "../constants";
import {
  CallWithConcurrentERC2771Request,
  CallWithConcurrentERC2771RequestOptionalParameters,
  CallWithERC2771Request,
  CallWithERC2771RequestOptionalParameters,
  ERC2771Type,
} from "../lib/erc2771/types";
import { Config, SignerOrProvider } from "../lib/types";

import { calculateDeadline } from "./calculateDeadline";
import { getUserNonce } from "./getUserNonce";
import { isConcurrentRequest } from "./isConcurrentRequest";
import { generateSalt } from "./generateSalt";
import { getProviderChainId } from "./getProviderChainId";

export async function populateOptionalUserParameters(
  payload: {
    request: CallWithConcurrentERC2771Request;
    type:
      | ERC2771Type.ConcurrentCallWithSyncFee
      | ERC2771Type.ConcurrentSponsoredCall;
    signerOrProvider?: SignerOrProvider;
  },

  config: Config
): Promise<Partial<CallWithConcurrentERC2771RequestOptionalParameters>>;

export async function populateOptionalUserParameters(
  payload: {
    request: CallWithERC2771Request;
    type: ERC2771Type.CallWithSyncFee | ERC2771Type.SponsoredCall;
    signerOrProvider?: SignerOrProvider;
  },

  config: Config
): Promise<Partial<CallWithERC2771RequestOptionalParameters>>;

export async function populateOptionalUserParameters(
  payload: {
    request: CallWithConcurrentERC2771Request | CallWithERC2771Request;
    type: ERC2771Type;
    signerOrProvider?: SignerOrProvider;
  },

  config: Config
): Promise<
  Partial<
    | CallWithConcurrentERC2771RequestOptionalParameters
    | CallWithERC2771RequestOptionalParameters
  >
> {
  if (isConcurrentRequest(payload.request)) {
    const { request } = payload;
    const parametersToOverride: Partial<CallWithConcurrentERC2771RequestOptionalParameters> =
      {};
    if (!request.userDeadline) {
      parametersToOverride.userDeadline =
        calculateDeadline(DEFAULT_DEADLINE_GAP);
    }
    if (!request.userSalt) {
      parametersToOverride.userSalt = generateSalt();
    }
    return parametersToOverride;
  } else {
    const { type, signerOrProvider, request } = payload;
    const parametersToOverride: Partial<CallWithERC2771RequestOptionalParameters> =
      {};
    if (!request.userDeadline) {
      parametersToOverride.userDeadline =
        calculateDeadline(DEFAULT_DEADLINE_GAP);
    }
    if (request.userNonce === undefined) {
      if (!signerOrProvider || !signerOrProvider.provider) {
        throw new Error("Missing provider.");
      }
      const providerChainId = await getProviderChainId(signerOrProvider);
      if (request.chainId !== providerChainId) {
        throw new Error(
          `Request and provider chain id mismatch. Request: [${request.chainId.toString()}], provider: [${providerChainId.toString()}]`
        );
      }
      parametersToOverride.userNonce = await getUserNonce(
        {
          account: request.user as string,
          type,
          signerOrProvider,
        },
        config
      );
    }
    return parametersToOverride;
  }
}
