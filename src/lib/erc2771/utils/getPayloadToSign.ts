import { getEIP712Domain } from "../../../utils";
import { EIP712_DOMAIN_TYPE_DATA } from "../../types";
import {
  EIP712_SPONSORED_CALL_ERC2771_TYPE_DATA,
  SponsoredCallERC2771PayloadToSign,
  CallWithERC2771Struct,
  ERC2771Type,
  EIP712_CALL_WITH_SYNC_FEE_ERC2771_TYPE_DATA,
  CallWithSyncFeeERC2771PayloadToSign,
} from "../types";

export const getPayloadToSign = (
  struct: CallWithERC2771Struct,
  type: ERC2771Type,
  isWallet: boolean
): SponsoredCallERC2771PayloadToSign | CallWithSyncFeeERC2771PayloadToSign => {
  const domain = getEIP712Domain(struct.chainId as number);

  switch (type) {
    case ERC2771Type.SponsoredCall:
      if (isWallet) {
        return {
          domain,
          types: {
            ...EIP712_SPONSORED_CALL_ERC2771_TYPE_DATA,
          },
          message: struct,
        };
      }
      return {
        domain,
        types: {
          ...EIP712_SPONSORED_CALL_ERC2771_TYPE_DATA,
          ...EIP712_DOMAIN_TYPE_DATA,
        },
        primaryType: "SponsoredCallERC2771",
        message: struct,
      };
    case ERC2771Type.CallWithSyncFee:
      if (isWallet) {
        return {
          domain,
          types: {
            ...EIP712_CALL_WITH_SYNC_FEE_ERC2771_TYPE_DATA,
          },
          message: struct,
        };
      }
      return {
        domain,
        types: {
          ...EIP712_CALL_WITH_SYNC_FEE_ERC2771_TYPE_DATA,
          ...EIP712_DOMAIN_TYPE_DATA,
        },
        primaryType: "CallWithSyncFeeERC2771",
        message: struct,
      };
    default:
      // eslint-disable-next-line no-case-declarations
      const _exhaustiveCheck: never = type;
      return _exhaustiveCheck;
  }
};
