import { providers } from "ethers";

import { SIGN_TYPED_DATA_V4 } from "../constants";

export const signTypedDataV4 = async (
  provider: providers.Web3Provider,
  address: string,
  payload: string
): Promise<string> => {
  return await provider.send(SIGN_TYPED_DATA_V4, [address, payload]);
};
