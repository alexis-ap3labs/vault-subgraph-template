#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Lire la configuration
const configPath = path.join(__dirname, '..', 'config.yaml');
const config = yaml.load(fs.readFileSync(configPath, 'utf8'));

// Template du subgraph.yaml
const subgraphTemplate = {
  specVersion: "0.0.5",
  schema: {
    file: "./schema.graphql"
  },
  dataSources: [
    {
      kind: "ethereum",
      name: config.contractName,
      network: config.network,
      source: {
        address: config.contractAddress,
        abi: config.contractName,
        startBlock: config.startBlock
      },
      mapping: {
        kind: "ethereum/events",
        apiVersion: "0.0.7",
        language: "wasm/assemblyscript",
        entities: [
          "TransferEvent",
          "ApprovalEvent", 
          "DepositEvent",
          "WithdrawEvent",
          "DepositRequestEvent",
          "RedeemRequestEvent",
          "SettleDepositEvent",
          "SettleRedeemEvent",
          "StateUpdatedEvent",
          "OperatorSetEvent",
          "RatesUpdatedEvent",
          "FeeReceiverUpdatedEvent",
          "TotalAssetsUpdatedEvent",
          "NewTotalAssetsUpdatedEvent",
          "HighWaterMarkUpdatedEvent",
          "WhitelistUpdatedEvent",
          "WhitelistManagerUpdatedEvent",
          "WhitelistDisabledEvent",
          "ValuationManagerUpdatedEvent",
          "OwnershipTransferStartedEvent",
          "OwnershipTransferredEvent",
          "ReferralEvent",
          "PausedEvent",
          "UnpausedEvent",
          "InitializedEvent"
        ],
        abis: [
          {
            name: config.contractName,
            file: `./abis/${config.contractName}.json`
          }
        ],
        eventHandlers: [
          {
            event: "Transfer(indexed address,indexed address,uint256)",
            handler: "handleTransfer"
          },
          {
            event: "Deposit(indexed address,indexed address,uint256,uint256)",
            handler: "handleDeposit"
          },
          {
            event: "DepositRequest(indexed address,indexed address,indexed uint256,address,uint256)",
            handler: "handleDepositRequest"
          },
          {
            event: "RedeemRequest(indexed address,indexed address,indexed uint256,address,uint256)",
            handler: "handleRedeemRequest"
          },
          {
            event: "SettleDeposit(indexed uint40,indexed uint40,uint256,uint256,uint256,uint256)",
            handler: "handleSettleDeposit"
          },
          {
            event: "SettleRedeem(indexed uint40,indexed uint40,uint256,uint256,uint256,uint256)",
            handler: "handleSettleRedeem"
          },
          {
            event: "TotalAssetsUpdated(uint256)",
            handler: "handleTotalAssetsUpdated"
          },
          {
            event: "NewTotalAssetsUpdated(uint256)",
            handler: "handleNewTotalAssetsUpdated"
          },
          {
            event: "Withdraw(indexed address,indexed address,indexed address,uint256,uint256)",
            handler: "handleWithdraw"
          },
          {
            event: "RatesUpdated((uint16,uint16),(uint16,uint16),uint256)",
            handler: "handleRatesUpdated"
          },
          {
            event: "StateUpdated(uint8)",
            handler: "handleStateUpdated"
          },
          {
            event: "OperatorSet(indexed address,indexed address,bool)",
            handler: "handleOperatorSet"
          },
          {
            event: "WhitelistUpdated(indexed address,bool)",
            handler: "handleWhitelistUpdated"
          },
          {
            event: "WhitelistDisabled()",
            handler: "handleWhitelistDisabled"
          },
          {
            event: "FeeReceiverUpdated(address,address)",
            handler: "handleFeeReceiverUpdated"
          },
          {
            event: "ValuationManagerUpdated(address,address)",
            handler: "handleValuationManagerUpdated"
          },
          {
            event: "WhitelistManagerUpdated(address,address)",
            handler: "handleWhitelistManagerUpdated"
          },
          {
            event: "HighWaterMarkUpdated(uint256,uint256)",
            handler: "handleHighWaterMarkUpdated"
          },
          {
            event: "Referral(indexed address,indexed address,indexed uint256,uint256)",
            handler: "handleReferral"
          },
          {
            event: "DepositRequestCanceled(indexed uint256,indexed address)",
            handler: "handleDepositRequestCanceled"
          },
          {
            event: "Paused(address)",
            handler: "handlePaused"
          },
          {
            event: "Unpaused(address)",
            handler: "handleUnpaused"
          },
          {
            event: "OwnershipTransferStarted(indexed address,indexed address)",
            handler: "handleOwnershipTransferStarted"
          },
          {
            event: "OwnershipTransferred(indexed address,indexed address)",
            handler: "handleOwnershipTransferred"
          },
          {
            event: "Initialized(uint64)",
            handler: "handleInitialized"
          }
        ],
        file: "./src/mapping.ts"
      }
    }
  ]
};

// Write the subgraph.yaml file
const outputPath = path.join(__dirname, '..', 'subgraph.yaml');
fs.writeFileSync(outputPath, yaml.dump(subgraphTemplate, { lineWidth: 120 }));

console.log(`✅ Subgraph generated successfully!`);
console.log(`📁 File: ${outputPath}`);
console.log(`🔧 Configuration used:`);
console.log(`   - Network: ${config.network}`);
console.log(`   - Contract: ${config.contractAddress}`);
console.log(`   - Start Block: ${config.startBlock}`);
console.log(`   - Name: ${config.contractName}`);
console.log(`   - Subgraph Name: ${config.subgraphName}`); 