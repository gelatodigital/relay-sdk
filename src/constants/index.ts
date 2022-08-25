import { utils } from "ethers";

export const GELATO_RELAY_URL = "https://relay.gelato.digital"; //Relay GW

export const SIGN_TYPED_DATA_V4 = "eth_signTypedData_v4";

export const DEFAULT_INTERNAL_ERROR_MESSAGE = "Internal Error";

export const getRelayAddress = (chainId: number): string => {
  switch (chainId) {
    case 80_001:
      return utils.getAddress("0xaBcC9b596420A9E9172FD5938620E265a0f9Df92");
    default:
      throw new Error(`getRelayAddress: chainId [${chainId}] is not supported`);
  }
};

export const getRelayWithTransferFromAddress = (chainId: number): string => {
  switch (chainId) {
    case 80_001:
      return utils.getAddress("0xaBcC9b596420A9E9172FD5938620E265a0f9Df92");
    default:
      throw new Error(
        `getRelayWithTransferFromAddress: chainId [${chainId}] is not supported`
      );
  }
};

export const DEFAULT_DEADLINE_GAP = 86_400; //24H
export const USER_NONCE_ABI = [
  "function userNonce(address account) external view returns (uint256)",
];
