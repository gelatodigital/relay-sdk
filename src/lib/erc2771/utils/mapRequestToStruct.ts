import { getAddress } from "ethers";

import {
  CallWithERC2771Request,
  CallWithERC2771RequestOptionalParameters,
  CallWithERC2771Struct,
} from "../types";

export const mapRequestToStruct = async (
  request: CallWithERC2771Request,
  override: Partial<CallWithERC2771RequestOptionalParameters>
): Promise<CallWithERC2771Struct> => {
  if (override.userNonce === undefined && request.userNonce === undefined) {
    throw new Error(`userNonce is not found in the request, nor fetched`);
  }

  if (!override.userDeadline && !request.userDeadline) {
    throw new Error(`userDeadline is not found in the request, nor fetched`);
  }

  return {
    userNonce:
      override.userNonce !== undefined
        ? override.userNonce
        : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          request.userNonce!,
    userDeadline:
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      override.userDeadline ?? request.userDeadline!,
    chainId: request.chainId,
    target: getAddress(request.target as string),
    data: request.data,
    user: getAddress(request.user as string),
  };
};
