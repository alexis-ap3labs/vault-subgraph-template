# Events Monitoring Scripts

This directory contains scripts for monitoring and querying events from your subgraph's MongoDB database.

## 📋 Available Scripts

### `get_latest_events.py`

A Python script to retrieve and display the latest events from your MongoDB subgraph database.

## 🚀 Quick Start

### Prerequisites

1. **Python dependencies**:
   ```bash
   pip install pymongo python-dotenv
   ```

2. **Environment variables** (create a `.env` file):
   ```bash
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB_NAME=vault_subgraph_db
   MONGODB_COLLECTION_NAME=vault_events
   ```

### Usage

```bash
python get_latest_events.py --type <event_type> --count <number> --decimals <decimals>
```

### Parameters

- `--type`: Event type to query (e.g., `depositRequest`, `withdraw`, `transfer`)
- `--count`: Number of results to display (default: 5)
- `--decimals`: Number of decimals for asset formatting (e.g., 6 for USDC, 18 for ETH)

### Examples

```bash
# Get 10 latest deposit requests (USDC - 6 decimals)
python get_latest_events.py --type depositRequest --count 10 --decimals 6

# Get 5 latest withdrawals (ETH - 18 decimals)
python get_latest_events.py --type withdraw --count 5 --decimals 18

# Get 3 latest transfers (EURC - 6 decimals)
python get_latest_events.py --type transfer --count 3 --decimals 6
```

## 📊 Output Format

The script displays events in the following format:

```
-------------------------------
ID         : 0xd11f69e6782cd123aecdf17669e3b4acf15caa3764e51758be8bbf172bdad62c6f000000
Assets     : 1478.084356
Timestamp  : 1751537839 (2025-07-03 10:17:19)
Controller : 0xd2054575db2229d591e536e6b3d483a426924a1e
Owner      : 0xd2054575db2229d591e536e6b3d483a426924a1e
Request ID : 9
Sender     : 0xd2054575db2229d591e536e6b3d483a426924a1e
-------------------------------
```

## 🔧 Common Event Types

Based on the Vault contract, you can query these event types:

- `depositRequest` - Deposit requests
- `withdraw` - Withdrawal events
- `transfer` - Token transfers
- `deposit` - Deposit events
- `redeemRequest` - Redemption requests
- `settleDeposit` - Deposit settlements
- `settleRedeem` - Redemption settlements
- `stateUpdated` - State changes
- `operatorSet` - Operator assignments
- `ratesUpdated` - Rate updates
- `whitelistUpdated` - Whitelist changes
- `paused` - Pause events
- `unpaused` - Unpause events

## 💡 Tips

- **Decimal precision**: Make sure to use the correct number of decimals for your asset:
  - USDC: 6 decimals
  - EURC: 6 decimals
  - ETH: 18 decimals
  - Most ERC-20 tokens: 18 decimals

- **Event types**: The exact event type names depend on your subgraph schema. Check your `schema.graphql` file for the exact entity names.

- **Database connection**: Ensure your MongoDB instance is running and accessible with the credentials in your `.env` file.

## 🔍 Troubleshooting

- **"No events found"**: Check that the event type exists in your database
- **Connection errors**: Verify your MongoDB URI and credentials
- **Decimal formatting issues**: Ensure you're using the correct decimal count for your asset 