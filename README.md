# Gelato Relay SDK <!-- omit in toc -->

SDK to integrate into Gelato Multichain Relay
<br/>

## Table of Contents <!-- omit in toc -->

- [Installation](#installation)
- [Payment Types](#paymentTypes)
- [Request Types](#requestTypes)
- [Sending ForwardCall (Payment of type 0)](#forwardCall)
- [Sending ForwardRequest (Payments of type 1, 2 or 3)](#forwardRequest)
- [Sending MetaTxRequest (Payments of type 1, 2 or 3)](#metaTxRequest)

## Installation

```bash
yarn add @gelatonetwork/gelato-relay-sdk
```

or

```bash
npm install @gelatonetwork/gelato-relay-sdk
```

## Payment Types

Upon sending messages and signatures to Gelato Relay API, Gelato Executors will acknowledge and execute them as soon as they are ready, hence paying gas fees in native token. Gelato Executors can have their fee costs refunded, plus a small fraction as incentive, in one of the following options:

Synchronous Payment (Type 0): This means that the `target` smart contract will pay Gelato Relay's smart contract as the call is forwarded. Payment can be done in `feeToken`, where it is expected to be a whitelisted payment token.

Asynchronous Gas Tank Payment (Type 1): This means that the `sponsor` must hold a balance in one of Gelato's Gas Tank smart contracts. The balance could even be held on a different `chainId` than the one the transaction is being relayed on (as defined by `sponsorChainId`). An event is emitted to tell Gelato how much to charge in the future, which shall be acknowledged in an off-chain accounting system. A `sponsor` signature is expected in order to ensure that the sponsor agrees on being charged up to a `maxFee` amount.

Synchronous Gas Tank Payment (Type 2): Similarly to `Type 1`, but `sponsor` is expected to hold a balance with Gelato on the same `chainId` where the transaction is executed. Fee deduction happens during the transaction. A `sponsor` signature is expected in order to ensure that the sponsor agrees on being charged up to a `maxFee` amount.

Synchronous Pull Fee Payment (Type 3): In this scenario a `sponsor` pre-approves the appropriate Gelato Relay's smart contract to spend tokens up so some maximum allowance value. During execution of the transaction, Gelato will credit due fees using `IERC20(feeToken).transferFrom(...)` in order to pull fees from his/her account. A `sponsor` signature is expected in order to ensure that the sponsor agrees on being charged up to a `maxFee` amount.

Note that payment of type 0 is the simplest one, as it requires no `sponsor` signature to be provided, but it assumes that the `target` smart contract refunds `msg.sender` due amount of fees in `feeToken`.

## Request Types

```ts
type ForwardCall = {
  chainId: number;
  target: string;
  data: BytesLike;
  feeToken: string;
};
```

`ForwardCall` is designed to handle payments of type 0, as it requires no signatures.

```ts
type ForwardRequest = {
  chainId: number;
  target: string;
  data: BytesLike;
  feeToken: string;
  paymentType: number;
  maxFee: string;
  sponsor: string;
  sponsorChainId: number;
  nonce: number;
  enforceSponsorNonce: boolean;
};
```

`ForwardRequest` is designed to handle payments of type 1, 2 and 3, in cases where all meta-transaction related logic (or other kinds of replay protection mechanisms such as hash based commitments) is already implemented inside `target` smart contract. The `sponsor` is still required to EIP-712 sign this request, in order to ensure the integrity of payments. Optionally, `nonce` may or may not be enforced, by setting `enforceSponsorNonce`. Some dApps may not need to rely on a nonce for `ForwardRequest` if they already implement strong forms of replay protection.

```ts
type MetaTxRequest = {
  chainId: number;
  target: string;
  data: BytesLike;
  feeToken: string;
  paymentType: number;
  maxFee: string;
  user: string;
  sponsor: string;
  sponsorChainId: number;
  nonce: number;
  deadline: number;
};
```

`MetaTxRequest` is designed to handle payments of type 1, 2 and 3, in cases where the `target` contract does not have any meta-transaction nor replay protection logic. In this case, the appropriate Gelato Relay's smart contract already verifies `user` and `sponsor` signatures. `user` is the EOA address that wants to interact with the dApp, while `sponsor` is the account that pays fees.

## Sending ForwardCall (Payment of type 0)

ForwardCall requests require no signatures and can be submitted by calling the following method in Gelato Relay SDK:

```ts
/**
 *
 * @param {number} chainId  - Chain ID.
 * @param {string} target   - Address of dApp's smart contract to call.
 * @param {string} data     - Payload for `target`.
 * @param {string} feeToken - paymentToken for Gelato Executors. Use `0xeee...` for native token.
 * @returns {PromiseLike<string>} taskId - Task ID.
 */
const sendCallRequest = async (
  chainId: number,
  target: string,
  data: string,
  feeToken: string
): Promise<string>;
```

## Sending ForwardRequest (Payments of type 1, 2 or 3)

Firstly, we build a `ForwardRequest` object using the following method:

```ts
/**
 *
 * @param {number} chainId              - Chain ID.
 * @param {string} target               - Address of dApp's smart contract to call.
 * @param {string} data                 - Payload for `target`.
 * @param {string} feeToken             - paymentToken for Gelato Executors. Use `0xeee...` for native token.
 * @param {number} paymentType          - Type identifier for Gelato's payment. Can be 1, 2 or 3.
 * @param {string} maxFee               - Maximum fee sponsor is willing to pay Gelato Executors.
 * @param {number} nonce                - Smart contract nonce for sponsor to sign.
 *                                        Can be 0 if enforceSponsorNonce is always false.
 * @param {boolean} enforceSponsorNonce - Whether or not to enforce replay protection using sponsor's nonce.
 * @param {string} sponsor              - EOA address that pays Gelato Executors.
 * @param {number} sponsorChainId       - Chain ID of where sponsor holds a Gas Tank balance with Gelato.
 *                                        Relevant for paymentType=1
 * @returns {ForwardRequest}
 */
const forwardRequest = (
  chainId: number,
  target: string,
  data: BytesLike,
  feeToken: string,
  paymentType: number,
  maxFee: string,
  nonce: number,
  enforceSponsorNonce: boolean,
  sponsor: string,
  sponsorChainId?: number
): ForwardRequest;
```

Then we send `request` to Gelato Relay API. `sponsorSignature` is the EIP-712 signature from `sponsor`.

```ts
/**
 *
 * @param {ForwardRequest} request  - ForwardRequest to be relayed by Gelato Executors.
 * @param {string} sponsorSignature - EIP-712 signature of sponsor (who pays Gelato Executors).
 * @returns {PromiseLike<string>} taskId - Task ID.
 */
const sendForwardRequest = async (
  request: ForwardRequest,
  sponsorSignature: BytesLike
): Promise<string>;
```

## Sending MetaTxRequest (Payments of type 1, 2 or 3)

Firstly we create `MetaTxRequest` object using the following SDK's method:

```ts
/**
 *
 * @param {number} chainId          - Chain ID.
 * @param {string} target           - Address of dApp's smart contract to call.
 * @param {string} data             - Payload for `target`.
 * @param {string} feeToken         - paymentToken for Gelato Executors. Use `0xeee...` for native token.
 * @param {number} paymentType      - Type identifier for Gelato's payment. Can be 1, 2 or 3.
 * @param {string} maxFee           - Maximum fee sponsor is willing to pay Gelato Executors.
 * @param {string} user             - EOA of dApp's user
 * @param {number} nonce            - user's smart contract nonce.
 * @param {string} [sponsor]        - EOA that pays Gelato Executors.
 * @param {number} [sponsorChainId] - Chain ID where sponsor holds a balance with Gelato.
 *                                    Relevant for paymentType=1.
 * @param {number} [deadline]       - Deadline for executing MetaTxRequest, UNIX timestamp in seconds.
 *                                    Can also be 0 (not enforced).
 * @returns
 */
const metaTxRequest = (
  chainId: number,
  target: string,
  data: BytesLike,
  feeToken: string,
  paymentType: number,
  maxFee: string,
  user: string,
  nonce: number,
  sponsor?: string,
  sponsorChainId?: number,
  deadline?: number
): MetaTxRequest;
```

Then we send `request` to Gelato Relay API. `userSignature` is the EIP-712 signature from dApp's user. If `sponsorSignature` is not passed, we assume `sponsor` is also the `user`, so that we set it equal to `sponsorSignature`.

```ts
/**
 *
 * @param {MetaTxRequest} request   - MetaTxRequest to be relayed by Gelato Executors.
 * @param {string} userSignature    - EIP-712 signature from user:
 *                                    EOA that interacts with target dApp's address.
 * @param {string} [sponsorSignature] - EIP-712 signature from sponsor:
 *                                    EOA that pays Gelato Executors, could be same as user.
 * @returns {string} taskId         - Task ID.
 */
const sendMetaTxRequest = async (
  request: MetaTxRequest,
  userSignature: BytesLike,
  sponsorSignature?: BytesLike
): Promise<string>;
```
