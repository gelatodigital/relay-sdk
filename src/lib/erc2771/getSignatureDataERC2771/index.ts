import { isConcurrentRequest, signTypedDataV4 } from "../../../utils";
import { Config, SignerOrProvider } from "../../types";
import {
  SignatureData,
  CallWithERC2771Request,
  ERC2771Type,
  CallWithConcurrentERC2771Request,
  SequentialSignatureData,
  ConcurrentSignatureData,
} from "../types";
import { getDataToSignERC2771 } from "../getDataToSignERC2771/index.js";

export async function getSignatureDataERC2771(
  payload: {
    request: CallWithERC2771Request;
    signerOrProvider: SignerOrProvider;
    type: ERC2771Type.CallWithSyncFee | ERC2771Type.SponsoredCall;
  },
  config: Config
): Promise<SequentialSignatureData>;

export async function getSignatureDataERC2771(
  payload: {
    request: CallWithConcurrentERC2771Request;
    signerOrProvider: SignerOrProvider;
    type:
      | ERC2771Type.ConcurrentCallWithSyncFee
      | ERC2771Type.ConcurrentSponsoredCall;
  },
  config: Config
): Promise<ConcurrentSignatureData>;

export async function getSignatureDataERC2771(
  payload: {
    request: CallWithERC2771Request | CallWithConcurrentERC2771Request;
    signerOrProvider: SignerOrProvider;
    type: ERC2771Type;
  },
  config: Config
): Promise<SignatureData>;

export async function getSignatureDataERC2771(
  payload: {
    request: CallWithERC2771Request | CallWithConcurrentERC2771Request;
    signerOrProvider: SignerOrProvider;
    type: ERC2771Type;
  },
  config: Config
): Promise<SignatureData> {
  try {
    const { request, signerOrProvider } = payload;

    if (isConcurrentRequest(request)) {
      const type = payload.type as
        | ERC2771Type.ConcurrentCallWithSyncFee
        | ERC2771Type.ConcurrentSponsoredCall;

      const { struct, typedData } = await getDataToSignERC2771(
        {
          request,
          signerOrProvider,
          type,
        },
        config
      );

      const signature = await signTypedDataV4(
        signerOrProvider,
        request.user as string,
        typedData
      );

      return {
        struct,
        signature,
      };
    } else {
      const type = payload.type as
        | ERC2771Type.CallWithSyncFee
        | ERC2771Type.SponsoredCall;

      const { struct, typedData } = await getDataToSignERC2771(
        {
          request,
          signerOrProvider,
          type,
        },
        config
      );

      const signature = await signTypedDataV4(
        signerOrProvider,
        request.user as string,
        typedData
      );

      return {
        struct,
        signature,
      };
    }
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/getSignatureDataERC2771: Failed with error: ${errorMessage}`
    );
  }
}
