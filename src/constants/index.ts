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
    case 4:
      return utils.getAddress("0xbeC333EDE1A0687D2b9624F8C073a54c93ba9777");
    case 5:
      return utils.getAddress("0xE2c5CE12FFBAF12FaEc238E029aBc5b0FF27F18b");
    case 42:
      return utils.getAddress("0x953c67EFFFB961244E72bcE8b887a6ead29c45AF");
    case 137:
      return utils.getAddress("0x91f2A140cA47DdF438B9c583b7E71987525019bB");
    case 80001:
      return utils.getAddress("0x8185048016f10efa675b0eF969c01b14006a4740");
    default:
      throw new Error(`getMetaBoxAddress: chainId ${chainId} not supported`);
  }
};

const getMetaBoxPullFeeAddress = (chainId: number): string => {
  switch (chainId) {
    case 4:
      return utils.getAddress("0xbeC333EDE1A0687D2b9624F8C073a54c93ba9777");
    case 5:
      return utils.getAddress("0xE2c5CE12FFBAF12FaEc238E029aBc5b0FF27F18b");
    case 42:
      return utils.getAddress("0xf93f0462D1882bf9CB5ecf1830ceFA826A254ADE");
    case 80001:
      return utils.getAddress("0xc2336e796F77E4E57b6630b6dEdb01f5EE82383e");
    default:
      throw new Error(
        `getMetaBoxPullFeeAddress: chainId ${chainId} not supported`
      );
  }
};

const getRelayForwarderAddress = (chainId: number): string => {
  switch (chainId) {
    case 4:
      return utils.getAddress("0x0343Af039E2E1c25A9691eEb654Ce0de1910C3e2");
    case 5:
      return utils.getAddress("0xDde7416baE4CcfB1f131038482D424AdD61cF378");
    case 42:
      return utils.getAddress("0xC176f63f3827afE6789FD737f4679B299F97d108");
    case 80001:
      return utils.getAddress("0x953c67EFFFB961244E72bcE8b887a6ead29c45AF");
    default:
      throw new Error(
        `getRelayForwarderAddress: chainId ${chainId} not supported`
      );
  }
};

const getRelayForwarderPullFeeAddress = (chainId: number): string => {
  switch (chainId) {
    case 4:
      return utils.getAddress("0x3894Be84b0490f24ca6b3eAa292d1afa7ad3b62a");
    case 5:
      return utils.getAddress("0x30227F1597e81Ca2b87161A68cdd2e330947CfA2");
    case 42:
      return utils.getAddress("0x8185048016f10efa675b0eF969c01b14006a4740");
    case 80001:
      return utils.getAddress("0xf93f0462D1882bf9CB5ecf1830ceFA826A254ADE");
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
