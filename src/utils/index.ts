import { utils } from "ethers";

import {
  getMetaBoxAddress,
  getMetaBoxPullFeeAddress,
  getRelayForwarderAddress,
  getRelayForwarderPullFeeAddress,
} from "../constants";
import { EIP712Domain } from "../types";

const abiCoder = new utils.AbiCoder();

const getEIP712Domain = (
  name: string,
  version: string,
  chainId: number,
  verifyingContract: string
): EIP712Domain => {
  return {
    name,
    version,
    chainId,
    verifyingContract,
  };
};

const getEIP712DomainSeparator = (
  name: string,
  version: string,
  chainId: number,
  address: string
): string => {
  try {
    const domainSeparator = utils.solidityKeccak256(
      ["bytes"],
      [
        abiCoder.encode(
          ["bytes32", "bytes32", "bytes32", "bytes32", "address"],
          [
            utils.solidityKeccak256(
              ["bytes"],
              [
                utils.toUtf8Bytes(
                  "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
              ]
            ),
            utils.solidityKeccak256(["bytes"], [utils.toUtf8Bytes(name)]),
            utils.solidityKeccak256(["bytes"], [utils.toUtf8Bytes(version)]),
            utils.hexZeroPad(utils.hexlify(chainId), 32),
            utils.getAddress(address),
          ]
        ),
      ]
    );

    return domainSeparator;
  } catch (error) {
    const errorMsg = (error as Error).message ?? String(error);

    throw new Error(`getEIPDomainSeparator: Failed with error: ${errorMsg}`);
  }
};

export {
  abiCoder,
  getMetaBoxAddress,
  getMetaBoxPullFeeAddress,
  getRelayForwarderAddress,
  getRelayForwarderPullFeeAddress,
  getEIP712Domain,
  getEIP712DomainSeparator,
};
