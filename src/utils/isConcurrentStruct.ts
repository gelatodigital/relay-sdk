import {
  CallWithConcurrentERC2771Struct,
  CallWithERC2771Struct,
} from "../lib/erc2771/types";

export const isConcurrentStruct = (
  struct: CallWithERC2771Struct | CallWithConcurrentERC2771Struct
): struct is CallWithConcurrentERC2771Struct => {
  return !!(struct as CallWithConcurrentERC2771Struct).userSalt;
};
