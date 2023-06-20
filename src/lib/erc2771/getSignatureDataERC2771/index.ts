import { ethers } from "ethers";

import { signTypedDataV4 } from "../../../utils";
import { Config } from "../../types";
import { SignatureData, CallWithERC2771Request, ERC2771Type } from "../types";
import { getDataToSignERC2771 } from "../getDataToSignERC2771/index.js";

export const getSignatureDataERC2771 = async (
  payload: {
    request: CallWithERC2771Request;
    walletOrProvider: ethers.providers.Web3Provider | ethers.Wallet;
    type: ERC2771Type;
  },
  config: Config
): Promise<SignatureData> => {
  try {
    const { request, walletOrProvider } = payload;
    if (!walletOrProvider.provider) {
      throw new Error(`Missing provider`);
    }

    const dataToSign = await getDataToSignERC2771(payload, config);

    const signature = await signTypedDataV4(
      walletOrProvider,
      request.user as string,
      dataToSign.payloadToSign
    );

    return {
      struct: dataToSign.struct,
      signature,
    };
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(
      `GelatoRelaySDK/getSignatureDataERC2771: Failed with error: ${errorMessage}`
    );
  }
};
