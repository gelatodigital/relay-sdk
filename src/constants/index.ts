import { utils } from "ethers";

const GELATO_RELAY_URL = "https://relay.gelato.digital";

const GELATO_GAS_BUFFER = 60000;

const METATX_REQUEST_TYPEHASH = utils.solidityKeccak256(
  ["string"],
  [
    "MetaTxRequest(uint256 chainId,address target,bytes data,address feeToken,uint256 paymentType,uint256 maxFee,uint256 gas,address user,address sponsor,uint256 sponsorChainId,uint256 nonce,uint256 deadline)",
  ]
);

const FORWARD_REQUEST_TYPEHASH = utils.solidityKeccak256(
  ["string"],
  [
    "ForwardRequest(uint256 chainId,address target,bytes data,address feeToken,uint256 paymentType,uint256 maxFee,uint256 gas,address sponsor,uint256 sponsorChainId,uint256 nonce,bool enforceSponsorNonce,bool enforceSponsorNonceOrdering)",
  ]
);

const getMetaBoxAddress = (chainId: number): string => {
  switch (chainId) {
    case 1:
      return utils.getAddress("0x60c5F77578b095a34d064a3e736F3a7bEb765C0D");
    case 4:
      return utils.getAddress("0x91f2A140cA47DdF438B9c583b7E71987525019bB");
    case 5:
      return utils.getAddress("0xC4a3D6d72Ff4D717EAaFaab9D9BF9609578Eec52");
    case 42:
      return utils.getAddress("0xE70aA6e2630CAbF5Dc6460674d175D21572B9b35");
    case 56:
      return utils.getAddress("0xbeC333EDE1A0687D2b9624F8C073a54c93ba9777");
    case 100:
      return utils.getAddress("0xbeC333EDE1A0687D2b9624F8C073a54c93ba9777");
    case 137:
      return utils.getAddress("0xB113360B7CD6660a032E7a1175116e86d38Ec4AF");
    case 1284:
      return utils.getAddress("0xa120a7d4EaF1910D38bc934D756DF507943a4C5a");
    case 1285:
      return utils.getAddress("0xEF68d6F0CCB444e1Dd2f1b076aFB54a9D7499b23");
    case 9001:
      return utils.getAddress("0x0d738c7fd96717305d82E5EF1D0fcc45C71042Fa");
    case 43114:
      return utils.getAddress("0x34670AF75F42efcDcC0B946006a3b3a2E2cD61B2");
    case 44787:
      return utils.getAddress("0xB113360B7CD6660a032E7a1175116e86d38Ec4AF");
    case 80001:
      return utils.getAddress("0x8F2510b3D61CE21b470d1fa4Fd657D82F692Cc6C");
    default:
      throw new Error(`getMetaBoxAddress: chainId ${chainId} not supported`);
  }
};

const getMetaBoxPullFeeAddress = (chainId: number): string => {
  switch (chainId) {
    case 4:
      return utils.getAddress("0xDf592cB2d32445F8e831d211AB20D3233cA41bD8");
    case 5:
      return utils.getAddress("0x287094e10A70DEecfD8bC377317bf3e9FE4bD287");
    case 42:
      return utils.getAddress("0xc6791fDab00944E18Ee809FC54a21B31f8A0B612");
    case 56:
      return utils.getAddress("0x2caD01dE572e00af828e5FB02EBf9821f03eD8f0");
    case 100:
      return utils.getAddress("0x2caD01dE572e00af828e5FB02EBf9821f03eD8f0");
    case 137:
      return utils.getAddress("0x0d738c7fd96717305d82E5EF1D0fcc45C71042Fa");
    case 1284:
      return utils.getAddress("0x34670AF75F42efcDcC0B946006a3b3a2E2cD61B2");
    case 1285:
      return utils.getAddress("0x5c54A5C104f90f5F987FeE09e3C579F40AC43301");
    case 9001:
      return utils.getAddress("0x38306FB998e48b3e4BCE9AB84463aae536413Cc4");
    case 43114:
      return utils.getAddress("0x69B910a1B856193784a7aa65F57830301D296Ea1");
    case 44787:
      return utils.getAddress("0x0d738c7fd96717305d82E5EF1D0fcc45C71042Fa");
    case 80001:
      return utils.getAddress("0x832e030fd726a032D4Bd1A6922363c8aa3cB4fFD");
    default:
      throw new Error(
        `getMetaBoxPullFeeAddress: chainId ${chainId} not supported`
      );
  }
};

const getRelayForwarderAddress = (chainId: number): string => {
  switch (chainId) {
    case 1:
      return utils.getAddress("0x5ca448e53e77499222741DcB6B3c959Fa829dAf2");
    case 4:
      return utils.getAddress("0x9B79b798563e538cc326D03696B3Be38b971D282");
    case 5:
      return utils.getAddress("0x61BF11e6641C289d4DA1D59dC3E03E15D2BA971c");
    case 42:
      return utils.getAddress("0x4F36f93F58d36DcbC1E60b9bdBE213482285C482");
    case 56:
      return utils.getAddress("0xeeea839E2435873adA11d5dD4CAE6032742C0445");
    case 100:
      return utils.getAddress("0xeeea839E2435873adA11d5dD4CAE6032742C0445");
    case 137:
      return utils.getAddress("0xc2336e796F77E4E57b6630b6dEdb01f5EE82383e");
    case 1284:
      return utils.getAddress("0x14cdD6d9eBfbB7DAAF09395E56B2A89905D62b4C");
    case 1285:
      return utils.getAddress("0x79A0cB573D3Db184752511969F1b869A184EA445");
    case 9001:
      return utils.getAddress("0x9561aCdf04C2B639dFfeCB357438e7B3eD979C5C");
    case 43114:
      return utils.getAddress("0x3456E168d2D7271847808463D6D383D079Bd5Eaa");
    case 44787:
      return utils.getAddress("0xc2336e796F77E4E57b6630b6dEdb01f5EE82383e");
    case 80001:
      return utils.getAddress("0x3428E19A01E40333D5D51465A08476b8F61B86f3");
    default:
      throw new Error(
        `getRelayForwarderAddress: chainId ${chainId} not supported`
      );
  }
};

const getRelayForwarderPullFeeAddress = (chainId: number): string => {
  switch (chainId) {
    case 4:
      return utils.getAddress("0x7c53a2A5153BC9990FDbAcA31A52Cd28c3B22270");
    case 5:
      return utils.getAddress("0x0a401e4a4aFAE5e4AF3735bf559c4d968F4d36e2");
    case 42:
      return utils.getAddress("0xA630AC87FD44CecF2eAE0273c1e297376F504978");
    case 56:
      return utils.getAddress("0x247A1306b6122ba28862b19a95004899db91f1b5");
    case 100:
      return utils.getAddress("0x247A1306b6122ba28862b19a95004899db91f1b5");
    case 137:
      return utils.getAddress("0x38306FB998e48b3e4BCE9AB84463aae536413Cc4");
    case 1284:
      return utils.getAddress("0xe8a5eE73f3c8F1Cd55915f6Eb5Fc7df4206f3C78");
    case 1285:
      return utils.getAddress("0x24D677f8A59A486BfC6d87E9453C4f1fEfcB0958");
    case 9001:
      return utils.getAddress("0xC176f63f3827afE6789FD737f4679B299F97d108");
    case 43114:
      return utils.getAddress("0xAEF3371bc3641d593cE1457339F7169d87931099");
    case 44787:
      return utils.getAddress("0x38306FB998e48b3e4BCE9AB84463aae536413Cc4");
    case 80001:
      return utils.getAddress("0xE70aA6e2630CAbF5Dc6460674d175D21572B9b35");
    default:
      throw new Error(
        `getRelayForwarderPullFeeAddress: chainId ${chainId} not supported`
      );
  }
};

export {
  GELATO_RELAY_URL,
  GELATO_GAS_BUFFER,
  getMetaBoxAddress,
  getMetaBoxPullFeeAddress,
  getRelayForwarderAddress,
  getRelayForwarderPullFeeAddress,
  METATX_REQUEST_TYPEHASH,
  FORWARD_REQUEST_TYPEHASH,
};
