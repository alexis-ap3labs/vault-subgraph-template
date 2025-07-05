# MongoDB Sync Service

This service synchronizes events from your subgraph to a MongoDB database for easier querying and analysis.

## 🎯 Purpose

The sync service fetches events from your deployed subgraph and stores them in MongoDB, allowing you to:
- Query events with complex filters
- Perform aggregations and analytics
- Monitor vault activity in real-time
- Build custom dashboards

## 🚀 Quick Start

### Prerequisites

1. **Environment variables** (create a `.env` file in the parent directory):
   ```bash
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB_NAME=vault_subgraph_db
   MONGODB_COLLECTION_NAME=vault_events
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Usage

#### GitHub Actions (Recommended)
The sync service is designed to be run via GitHub Actions for automated, scheduled synchronization.

**Manual trigger:**
```bash
# Trigger the sync workflow manually from GitHub Actions
# Go to Actions > Run Mongo Sync > Run workflow
```

**Scheduled trigger:**
Update the workflow file `.github/workflows/run-mongo-sync.yml` to add scheduling:
```yaml
on:
  workflow_dispatch:  # Manual trigger
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
    - cron: '0 0 * * *'    # Daily at midnight
```

**Environment variables in GitHub:**
Set these secrets in your repository settings:
- `MONGODB_URI` - Your MongoDB connection string
- `MONGODB_DB_NAME` - Database name
- `MONGODB_COLLECTION_NAME` - Collection name

#### Local Development
```bash
# Run a single sync operation locally
npm run sync

# Run in development mode
npm run dev
```

## 📊 What Gets Synced

The service synchronizes these event types from your subgraph:

- **`depositRequestEvents`** - Deposit requests
- **`redeemRequestEvents`** - Redemption requests  
- **`depositEvents`** - Successful deposits
- **`withdrawEvents`** - Withdrawals
- **`settleDepositEvents`** - Deposit settlements
- **`settleRedeemEvents`** - Redemption settlements
- **`totalAssetsUpdatedEvents`** - Total assets updates
- **`newTotalAssetsUpdatedEvents`** - New total assets updates
- **`highWaterMarkUpdatedEvents`** - High water mark updates

## 🔄 Sync Process

1. **Check last sync state** - Reads the last `blockTimestamp` for each event type
2. **Fetch latest events** - Gets the most recent event from the subgraph
3. **Compare timestamps** - Determines if new events need to be synced
4. **Fetch new events** - Retrieves events after the last synced timestamp
5. **Store in MongoDB** - Inserts new events with their type classification
6. **Update sync state** - Records the latest timestamp for next sync

## 📁 Project Structure

```
mongo-sync/
├── src/
│   ├── config/
│   │   └── config.ts          # Configuration and environment variables
│   ├── models/
│   │   ├── events.ts          # MongoDB event model
│   │   └── syncState.ts       # Sync state tracking model
│   ├── services/
│   │   ├── mongodb.ts         # MongoDB connection service
│   │   └── subgraph.ts        # Subgraph query service
│   └── index.ts               # Main sync logic
├── sync-once.js               # One-time sync script (used by GitHub Actions)
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🔄 GitHub Actions Workflow

The `.github/workflows/run-mongo-sync.yml` file defines the GitHub Actions workflow:

- **Manual trigger** - Run sync on demand via GitHub Actions UI
- **Scheduled trigger** - Automatically run sync at specified intervals
- **Environment secrets** - Secure storage of MongoDB credentials
- **Ubuntu runner** - Reliable execution environment

## 🔧 Configuration

### Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `MONGODB_DB_NAME` - Database name
- `MONGODB_COLLECTION_NAME` - Collection name for events

### Subgraph URL

The subgraph URL is configured in `src/config/config.ts`. Update it to point to your deployed subgraph.

## 📈 Monitoring

After syncing, you can use the `events/get_latest_events.py` script to query and monitor the synced data:

```bash
cd ../events
python get_latest_events.py --type depositRequest --count 10 --decimals 6
```

## 💡 Tips

- **Use GitHub Actions** - Set up scheduled triggers for automated syncing
- **Monitor workflow runs** - Check GitHub Actions logs for sync status and errors
- **Secure your secrets** - Store MongoDB credentials as GitHub repository secrets
- **Backup your data** - Consider backing up your MongoDB database regularly
- **Scale as needed** - The sync is incremental, so it only fetches new events

## 🔍 Troubleshooting

- **Connection errors** - Verify your MongoDB URI and credentials in GitHub secrets
- **Subgraph errors** - Check that your subgraph is deployed and accessible
- **Missing events** - Ensure your subgraph is indexing the events you need
- **Sync state issues** - Check the `syncState` collection in MongoDB for any corrupted state
- **Workflow failures** - Check GitHub Actions logs for detailed error messages
- **Rate limiting** - The service includes automatic endpoint fallback and blacklisting 