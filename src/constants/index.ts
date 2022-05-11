import { utils } from "ethers";

const GELATO_RELAY_URL = "https://gateway.api.gelato.digital";

const METATX_REQUEST_TYPEHASH = utils.solidityKeccak256(
  ["string"],
  [
    "MetaTxRequest(uint256 chainId,address target,bytes data,address feeToken,uint256 paymentType,uint256 maxFee,address user,address sponsor,uint256 sponsorChainId,uint256 nonce,uint256 deadline)",
  ]
);

const FORWARD_REQUEST_TYPEHASH = utils.solidityKeccak256(
  ["string"],
  [
    "ForwardRequest(uint256 chainId,address target,bytes data,address feeToken,uint256 paymentType,uint256 maxFee,address sponsor,uint256 sponsorChainId,uint256 nonce,bool enforceSponsorNonce)",
  ]
);

const getMetaBoxAddress = (chainId: number): string => {
  switch (chainId) {
    case 42:
      return utils.getAddress("0x953c67EFFFB961244E72bcE8b887a6ead29c45AF");
    default:
      throw new Error(`getMetaBoxAddress: chainId ${chainId} not supported`);
  }
};

const getMetaBoxPullFeeAddress = (chainId: number): string => {
  switch (chainId) {
    case 42:
      return utils.getAddress("0xf93f0462D1882bf9CB5ecf1830ceFA826A254ADE");
    default:
      throw new Error(
        `getMetaBoxPullFeeAddress: chainId ${chainId} not supported`
      );
  }
};

const getRelayForwarderAddress = (chainId: number): string => {
  switch (chainId) {
    case 42:
      return utils.getAddress("0xC176f63f3827afE6789FD737f4679B299F97d108");
    default:
      throw new Error(
        `getRelayForwarderAddress: chainId ${chainId} not supported`
      );
  }
};

const getRelayForwarderPullFeeAddress = (chainId: number): string => {
  switch (chainId) {
    case 42:
      return utils.getAddress("0x8185048016f10efa675b0eF969c01b14006a4740");
    default:
      throw new Error(
        `getRelayForwarderPullFeeAddress: chainId ${chainId} not supported`
      );
  }
};

export {
  GELATO_RELAY_URL,
  getMetaBoxAddress,
  getMetaBoxPullFeeAddress,
  getRelayForwarderAddress,
  getRelayForwarderPullFeeAddress,
  METATX_REQUEST_TYPEHASH,
  FORWARD_REQUEST_TYPEHASH,
};
