import {
  CallWithConcurrentERC2771Struct,
  CallWithERC2771Struct,
} from "../types";
import { SafeRequestPayload } from "../../types";
import { isConcurrentStruct } from "../../../utils";

export function safeTransformStruct(
  struct: CallWithERC2771Struct
): SafeRequestPayload<CallWithERC2771Struct>;

export function safeTransformStruct(
  struct: CallWithConcurrentERC2771Struct
): SafeRequestPayload<CallWithConcurrentERC2771Struct>;

export function safeTransformStruct(
  struct: CallWithERC2771Struct | CallWithConcurrentERC2771Struct
): SafeRequestPayload<CallWithERC2771Struct | CallWithConcurrentERC2771Struct> {
  if (isConcurrentStruct(struct)) {
    return {
      ...struct,
      chainId: struct.chainId.toString(),
    } as SafeRequestPayload<CallWithConcurrentERC2771Struct>;
  } else {
    return {
      ...struct,
      chainId: struct.chainId.toString(),
      userNonce: struct.userNonce.toString(),
    } as SafeRequestPayload<CallWithERC2771Struct>;
  }
}
