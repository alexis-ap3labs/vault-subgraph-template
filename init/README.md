# Vault Subgraph Template

This template allows you to easily deploy a subgraph for any Vault contract on any Ethereum network.

## 🚀 Quick Start

### 1. Configuration
Modify the `config.yaml` file with your parameters:

```yaml
network: "base"                    # Blockchain network (mainnet, base, polygon, etc.)
contractAddress: "0x..."           # Your Vault contract address
startBlock: 12345678               # Starting block for indexing
contractName: "Vault"              # Contract name
description: "Vault Subgraph"       # Description

# Graph deployment configuration
subgraphName: "your-subgraph-name"  # Your subgraph name on The Graph
deployKey: "your-deploy-key"        # Your Graph deploy key
```

### 2. Installation and generation
```bash
# Install dependencies
npm install

# Generate subgraph.yaml from config
npm run generate

# Generate TypeScript types
npm run codegen

# Build the subgraph
npm run build
```

### 3. Deployment
```bash
# Deploy to The Graph
npm run deploy
```

**Before deploying:**
1. Update `subgraphName` in `config.yaml` with your desired name (e.g., "my-vault-subgraph")
2. Get your deploy key from https://thegraph.com/studio/apikeys
3. Add your `deployKey` to `config.yaml`

## 📁 Project Structure

```
├── config.yaml              # Deployment-specific configuration
├── subgraph.yaml            # Auto-generated (do not modify manually)
├── schema.graphql           # GraphQL schema (common to all Vaults)
├── src/
│   └── mapping.ts           # Mapping logic (common to all Vaults)
├── abis/
│   └── Vault.json           # Vault contract ABI
├── scripts/
│   └── generate-subgraph.js # Generation script
└── README.md               # This file
```

## 🔧 Customization

### Adding new events
1. Modify `schema.graphql` to add new entities
2. Add handlers in `src/mapping.ts`
3. Update the `scripts/generate-subgraph.js` script to include new events

### Changing network
Simply modify the `network` value in `config.yaml`:
- `mainnet` for Ethereum mainnet
- `base` for Base
- `polygon` for Polygon
- etc.

### Changing contract
1. Replace the ABI in `abis/Vault.json`
2. Update `contractAddress` and `startBlock` in `config.yaml`
3. Regenerate with `npm run generate`

## 📋 Indexed Events

This subgraph indexes all important vault contract events:
- `Transfer` - Token transfers
- `Deposit` - Vault deposits
- `Withdraw` - Vault withdrawals
- `DepositRequest` - Deposit requests
- `RedeemRequest` - Redemption requests
- `SettleDeposit` - Deposit settlements
- `SettleRedeem` - Redemption settlements
- And many more...

## 🤝 Contributing

This template is designed to be easily reusable. If you add new features, remember to:
1. Keep common logic in base files
2. Maintain compatibility with external configuration
3. Document new options

## 📝 Notes

- The `subgraph.yaml` file is auto-generated, do not modify it manually
- All files in `src/` and `schema.graphql` are common to all deployments
- Only `config.yaml` needs to be customized for each deployment 