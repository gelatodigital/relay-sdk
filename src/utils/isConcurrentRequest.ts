import {
  CallWithConcurrentERC2771Request,
  CallWithERC2771Request,
} from "../lib/erc2771/types";

export const isConcurrentRequest = (
  request: CallWithERC2771Request | CallWithConcurrentERC2771Request
): request is CallWithConcurrentERC2771Request => {
  return !!(request as CallWithConcurrentERC2771Request).isConcurrent;
};
