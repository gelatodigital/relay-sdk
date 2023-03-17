import { getEIP712Domain } from "../../../utils";
import { Config, EIP712_DOMAIN_TYPE_DATA } from "../../types";
import {
  EIP712_SPONSORED_CALL_ERC2771_TYPE_DATA,
  SponsoredCallERC2771PayloadToSign,
  CallWithERC2771Struct,
  ERC2771Type,
  EIP712_CALL_WITH_SYNC_FEE_ERC2771_TYPE_DATA,
  CallWithSyncFeeERC2771PayloadToSign,
} from "../types";

export const getPayloadToSign = (
  payload: {
    struct: CallWithERC2771Struct;
    type: ERC2771Type;
    isWallet: boolean;
  },
  config: Config
): SponsoredCallERC2771PayloadToSign | CallWithSyncFeeERC2771PayloadToSign => {
  const { isWallet, struct, type } = payload;
  const domain = getEIP712Domain({ chainId: struct.chainId as number }, config);

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
