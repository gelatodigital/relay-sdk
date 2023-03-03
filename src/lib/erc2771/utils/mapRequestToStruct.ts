import { BigNumber } from "ethers";
import { getAddress } from "ethers/lib/utils";

import {
  CallWithERC2771Request,
  CallWithERC2771RequestOptionalParameters,
  CallWithERC2771Struct,
} from "../types";

export const mapRequestToStruct = async (
  request: CallWithERC2771Request,
  override: Partial<CallWithERC2771RequestOptionalParameters>
): Promise<CallWithERC2771Struct> => {
  if (!override.userNonce && !request.userNonce) {
    throw new Error(`userNonce is not found in the request, nor fetched`);
  }
  if (!override.userDeadline && !request.userDeadline) {
    throw new Error(`userDeadline is not found in the request, nor fetched`);
  }
  return {
    userNonce:
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      override.userNonce ?? BigNumber.from(request.userNonce!).toString(),
    userDeadline:
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      override.userDeadline ?? BigNumber.from(request.userDeadline!).toString(),
    chainId: BigNumber.from(request.chainId).toString(),
    target: getAddress(request.target as string),
    data: request.data,
    user: getAddress(request.user as string),
  };
};
