import { utils } from "ethers";

export const GELATO_RELAY_URL = "http://localhost:8080";

export const SIGN_TYPED_DATA_V4 = "eth_signTypedData_v4";

export const getRelayAddress = (chainId: number): string => {
  switch (chainId) {
    case 80_001:
      return utils.getAddress("0xaBcC9b596420A9E9172FD5938620E265a0f9Df92");
    default:
      throw new Error(`getRelayAddress: chainId [${chainId}] is not supported`);
  }
};

export const DEFAULT_DEADLINE_GAP = 86_400;
export const ABI = [
  "function userNonce(address account) external view returns (uint256)",
];
