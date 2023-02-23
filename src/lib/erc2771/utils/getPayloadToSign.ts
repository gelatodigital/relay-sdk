import { Wallet } from "ethers";

import { getEIP712Domain } from "../../../utils";
import { EIP712_DOMAIN_TYPE_DATA } from "../../types";
import {
  EIP712_SPONSORED_CALL_ERC2771_TYPE_DATA,
  SponsoredCallERC2771PayloadToSign,
  SponsoredCallERC2771Struct,
} from "../types";

export const getPayloadToSign = (
  struct: SponsoredCallERC2771Struct,
  wallet?: Wallet
): SponsoredCallERC2771PayloadToSign => {
  const domain = getEIP712Domain(struct.chainId as number);
  const types = wallet
    ? EIP712_SPONSORED_CALL_ERC2771_TYPE_DATA
    : {
        ...EIP712_SPONSORED_CALL_ERC2771_TYPE_DATA,
        ...EIP712_DOMAIN_TYPE_DATA,
      };
  return {
    domain,
    types,
    primaryType: "SponsoredCallERC2771",
    message: struct,
  };
};
