# Gelato Relay SDK <!-- omit in toc -->

SDK to integrate into Gelato Multichain Relay
<br/>

## Table of Contents <!-- omit in toc -->

- [Installation](#installation)
- [Introduction](#introduction)

## Installation

For the new Relay integration, please use `version 1.0.1 and above`

```bash
yarn add @gelatonetwork/relay-sdk
```

or

```bash
npm install @gelatonetwork/relay-sdk
```

## Introduction

Gelato Relay SDK offers a convenient suite of functions in order to interact with Gelato Relay API.
Gelato Relay API is a service that allows users and developers to get transactions mined fast, reliably and securely, without having to deal with the low-level complexities of blockchains.

As requests are submitted to Gelato Relay API, a network of Gelato Executors will execute and get said transactions mined as soon as they become executable (hence paying for gas fees). ECDSA signatures enforce the integrity of data whenever necessary, while gas fee refunds can be handled in any of our supported payment types. In this way, users and developers no longer have to become their own central point of failure with regards to their blockchain infrastructure, which may improve on the UX, costs, security and liveness of their Web3 systems.
