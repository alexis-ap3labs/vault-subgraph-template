# Vault Subgraph Template for Lagoon

A comprehensive template for deploying and monitoring subgraphs for Lagoon vault contracts on any EVM network. This template provides everything you need to index, query, and analyze vault events with automated synchronization to MongoDB.

## 🎯 Overview

This template is specifically designed for **Lagoon vault contracts** and provides:

- **Automated subgraph deployment** for any vault contract
- **MongoDB synchronization** for complex querying and analytics
- **Event monitoring tools** for real-time vault activity tracking
- **GitHub Actions automation** for scheduled data synchronization

## 🏗️ Project Structure

```
vault-subgraph-template/
├── init/                     # Subgraph initialization and deployment
├── mongo-sync/              # MongoDB synchronization service
├── events/                  # Event monitoring and querying tools
├── .github/workflows/       # GitHub Actions automation
└── .gitignore              # Git ignore configuration
```

## 📁 Directory Breakdown

### 🚀 `/init` - Subgraph Deployment
The core subgraph deployment module that handles:
- **Configuration management** via `config.yaml`
- **Automatic subgraph generation** from templates
- **TypeScript code generation** for type safety
- **Deployment to The Graph** with custom parameters

**Key files:**
- `config.yaml` - Deployment configuration (network, contract address, etc.)
- `subgraph.yaml` - Auto-generated subgraph manifest
- `schema.graphql` - GraphQL schema for vault events
- `src/mapping.ts` - Event mapping logic
- `abis/Vault.json` - Contract ABI

**Quick start:**
```bash
cd init
npm install
# Edit config.yaml with your vault details
npm run generate
npm run codegen
npm run build
npm run deploy
```

### 🔄 `/mongo-sync` - Database Synchronization
A Node.js service that synchronizes subgraph events to MongoDB for advanced querying:

**Features:**
- **Incremental synchronization** - Only fetches new events
- **Multiple event types** - Deposits, withdrawals, settlements, etc.
- **State tracking** - Maintains sync progress across runs
- **GitHub Actions integration** - Automated scheduled syncing

**Key files:**
- `src/index.ts` - Main sync logic
- `src/services/` - MongoDB and subgraph services
- `src/models/` - Database models
- `sync-once.js` - One-time sync script for GitHub Actions

**Setup:**
```bash
cd mongo-sync
npm install
# Configure environment variables
npm run sync
```

### 📊 `/events` - Event Monitoring
Python scripts for querying and monitoring vault events from MongoDB:

**Features:**
- **Flexible event querying** by type and count
- **Decimal formatting** for different assets (USDC, ETH, etc.)
- **Human-readable output** with timestamps and addresses
- **Real-time monitoring** capabilities

**Key files:**
- `get_latest_events.py` - Main event querying script

**Usage:**
```bash
cd events
python get_latest_events.py --type depositRequest --count 10 --decimals 6
```

### 🤖 `/.github/workflows` - Automation
GitHub Actions workflows for automated operations:

**Features:**
- **Scheduled MongoDB sync** - Automatic data synchronization
- **Manual triggers** - On-demand sync execution
- **Environment secrets** - Secure credential management
- **Ubuntu runners** - Reliable execution environment

**Key files:**
- `run-mongo-sync.yml` - MongoDB synchronization workflow

## 🚀 Quick Start Guide

### 1. Initial Setup
```bash
# Clone the template
git clone <repository-url>
cd vault-subgraph-template

# Configure your vault
cd init
# Edit config.yaml with your vault contract details
```

### 2. Deploy Subgraph
```bash
cd init
npm install
npm run generate
npm run codegen
npm run build
npm run deploy
```

### 3. Setup MongoDB Sync
```bash
cd ../mongo-sync
npm install

# Configure GitHub secrets:
# - MONGODB_URI
# - MONGODB_DB_NAME  
# - MONGODB_COLLECTION_NAME
```

### 4. Monitor Events
```bash
cd ../events
python get_latest_events.py --type depositRequest --count 5 --decimals 6
```

## 🔧 Configuration

### Subgraph Configuration (`init/config.yaml`)
```yaml
network: "base"                    # Blockchain network
contractAddress: "0x..."           # Your vault contract address
startBlock: 12345678               # Starting block for indexing
contractName: "Vault"              # Contract name
description: "Lagoon Vault Subgraph" # Description
subgraphName: "your-vault-subgraph" # Subgraph name on The Graph
deployKey: "your-deploy-key"       # Graph deploy key
```

### MongoDB Configuration
Set these environment variables:
```bash
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=vault_subgraph_db
MONGODB_COLLECTION_NAME=vault_events
```

## 📊 Indexed Events

The subgraph indexes all important Lagoon vault events:
- **`Transfer`** - Token transfers between addresses
- **`Deposit`** - Successful vault deposits
- **`Withdraw`** - Vault withdrawals
- **`DepositRequest`** - Deposit requests (pending)
- **`RedeemRequest`** - Redemption requests (pending)
- **`SettleDeposit`** - Deposit settlements
- **`SettleRedeem`** - Redemption settlements
- **`TotalAssetsUpdated`** - Total assets changes
- **`HighWaterMarkUpdated`** - High water mark updates
- **`StateUpdated`** - Vault state changes
- **`OperatorSet`** - Operator assignments
- **`RatesUpdated`** - Rate updates
- **`WhitelistUpdated`** - Whitelist modifications
- **`Paused`/`Unpaused`** - Pause state changes

## 🔄 Automation Workflow

1. **Subgraph Deployment** - Deploy once with your vault configuration
2. **Scheduled Sync** - GitHub Actions runs MongoDB sync every 6 hours
3. **Event Monitoring** - Use Python scripts to query and analyze events
4. **Real-time Updates** - Subgraph continuously indexes new events

## 🛠️ Customization

### Adding New Events
1. Update `init/schema.graphql` with new entities
2. Add handlers in `init/src/mapping.ts`
3. Update `init/scripts/generate-subgraph.js`
4. Regenerate and redeploy

### Changing Networks
Simply modify the `network` value in `init/config.yaml`:
- `mainnet` - Ethereum mainnet
- `base` - Base network
- `polygon` - Polygon network
- `arbitrum` - Arbitrum One
- Any other supported network

### Custom Event Types
The template supports any event type from your vault contract. Just ensure:
1. The event is included in your contract ABI
2. The event is added to the subgraph schema
3. Mapping logic is implemented

## 🔍 Monitoring & Analytics

### Real-time Monitoring
```bash
# Monitor latest deposit requests
python events/get_latest_events.py --type depositRequest --count 10 --decimals 6

# Monitor withdrawals
python events/get_latest_events.py --type withdraw --count 5 --decimals 18

# Monitor all events
python events/get_latest_events.py --type all --count 20 --decimals 6
```

### MongoDB Queries
Once synced, you can perform complex queries:
```javascript
// Get all events for a specific user
db.vault_events.find({owner: "0x..."})

// Get events in date range
db.vault_events.find({
  blockTimestamp: {
    $gte: 1751537839,
    $lte: 1751624239
  }
})

// Aggregate by event type
db.vault_events.aggregate([
  {$group: {_id: "$eventType", count: {$sum: 1}}}
])
```

## 🚨 Troubleshooting

### Common Issues

**Subgraph deployment fails:**
- Verify contract address and start block
- Check deploy key is correct
- Ensure network is supported

**MongoDB sync issues:**
- Verify MongoDB connection string
- Check GitHub secrets are set correctly
- Review GitHub Actions logs

**Event monitoring problems:**
- Ensure correct decimal count for your asset
- Verify event type exists in database
- Check MongoDB connection

### Support
- Check individual README files in each directory
- Review GitHub Actions logs for sync issues
- Verify environment variables and secrets

## 🤝 Contributing

This template is designed for Lagoon vaults but can be adapted for other vault protocols. When contributing:

1. Keep common logic in base files
2. Maintain compatibility with external configuration
3. Document new options and features
4. Test with different networks and contract versions

## 📝 License

This template is provided as-is for deploying subgraphs for Lagoon vault contracts. Modify as needed for your specific use case.

---

**Ready to deploy your Lagoon vault subgraph?** Start with the `/init` directory and follow the quick start guide above! 🚀 