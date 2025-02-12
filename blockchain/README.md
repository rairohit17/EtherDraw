# Chainlink VRF v2.5 Implementation Guide

## Overview
A step-by-step guide to implement Chainlink's Verifiable Random Function (VRF) v2.5 in your smart contracts. 

### Key Components
1. **Consumer Contract**: Handles random number requests and fulfillment
2. **Subscription Management**: Prepaid account for VRF usage
3. **VRF Coordinator**: Chainlink's verification and callback system

## Workflow Summary

### 1. Consumer Contract Setup
- Create a consumer contract that inherits from `VRFConsumerBaseV2Plus`
- Initialize with your chain's VRF Coordinator address
- Store subscription ID and other configuration parameters

### 2. Subscription Management
1. Create a subscription through [Chainlink VRF Dashboard](https://vrf.chain.link/)
2. Fund subscription with either:
   - Native blockchain currency (ETH, MATIC, etc.)
   - LINK tokens
3. Add consumer contract address to authorized consumers


### 3. Request Configuration
When calling `requestRandomWords` from the VRF Coordinator, provide:
```solidity
struct RandomWordsRequest {
  bytes32 keyHash;           // Gas lane identifier
  uint256 subId;             // Subscription ID
  uint16 requestConfirmations; // Block confirmations (typically 3)
  uint32 callbackGasLimit;   // Gas for fulfillment function
  uint32 numWords;           // Number of random values needed
  bytes extraArgs;           // Additional parameters (optional)
}
```
### 4. callback fulfullRandomWords by the coordinator
after requesting the number the coordinator will automatically callback fulfillRandomWords function upon completion the result can be logged in this function 


