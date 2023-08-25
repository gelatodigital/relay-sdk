import { getAddress } from "ethers";

import {
  CallWithConcurrentERC2771Request,
  CallWithConcurrentERC2771RequestOptionalParameters,
  CallWithConcurrentERC2771Struct,
  CallWithERC2771Request,
  CallWithERC2771RequestOptionalParameters,
  CallWithERC2771Struct,
} from "../types";
import { isConcurrentRequest } from "../../../utils";

export async function mapRequestToStruct(
  request: CallWithConcurrentERC2771Request,
  override: Partial<CallWithConcurrentERC2771RequestOptionalParameters>
): Promise<CallWithConcurrentERC2771Struct>;

export async function mapRequestToStruct(
  request: CallWithERC2771Request,
  override: Partial<CallWithERC2771RequestOptionalParameters>
): Promise<CallWithERC2771Struct>;

export async function mapRequestToStruct(
  request: CallWithERC2771Request | CallWithConcurrentERC2771Request,
  override: Partial<
    | CallWithERC2771RequestOptionalParameters
    | CallWithConcurrentERC2771RequestOptionalParameters
  >
): Promise<CallWithERC2771Struct | CallWithConcurrentERC2771Struct> {
  if (!override.userDeadline && !request.userDeadline) {
    throw new Error(`userDeadline is not found in the request, nor fetched`);
  }

  if (isConcurrentRequest(request)) {
    const concurrentOverride =
      override as Partial<CallWithConcurrentERC2771RequestOptionalParameters>;
    return {
      userDeadline: concurrentOverride.userDeadline ?? request.userDeadline,
      chainId: request.chainId,
      target: getAddress(request.target as string),
      data: request.data,
      user: getAddress(request.user as string),
      userSalt: concurrentOverride.userSalt ?? request.userSalt,
    } as CallWithConcurrentERC2771Struct;
  } else {
    const nonConcurrentOverride =
      override as Partial<CallWithERC2771RequestOptionalParameters>;
    if (
      nonConcurrentOverride.userNonce === undefined &&
      request.userNonce === undefined
    ) {
      throw new Error(`userNonce is not found in the request, nor fetched`);
    }
    return {
      userDeadline: nonConcurrentOverride.userDeadline ?? request.userDeadline,
      chainId: request.chainId,
      target: getAddress(request.target as string),
      data: request.data,
      user: getAddress(request.user as string),
      userNonce:
        nonConcurrentOverride.userNonce !== undefined
          ? nonConcurrentOverride.userNonce
          : request.userNonce,
    } as CallWithERC2771Struct;
  }
}
