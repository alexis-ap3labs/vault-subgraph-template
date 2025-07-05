import { connectToMongoDB } from './services/mongodb';
import { fetchAllEvents, fetchLatestEvent, fetchEventsAfter } from './services/subgraph';
import { Event } from './models/events';
import { SyncState } from './models/syncState';
import { config } from './config/config';

const eventTypes = [
  { key: 'depositRequestEvents', fields: 'id controller owner requestId sender assets blockTimestamp transactionHash', type: 'depositRequest' },
  { key: 'redeemRequestEvents', fields: 'id controller owner requestId sender shares blockTimestamp transactionHash', type: 'redeemRequest' },
  { key: 'depositEvents', fields: 'id sender owner assets shares blockTimestamp transactionHash', type: 'deposit' },
  { key: 'newTotalAssetsUpdatedEvents', fields: 'id totalAssets blockTimestamp transactionHash', type: 'newTotalAssetsUpdated' },
  { key: 'settleRedeemEvents', fields: 'id epochId settledId totalAssets totalSupply assetsWithdrawed sharesBurned blockTimestamp transactionHash', type: 'settleRedeem' },
  { key: 'settleDepositEvents', fields: 'id epochId settledId totalAssets totalSupply assetsDeposited sharesMinted blockTimestamp transactionHash', type: 'settleDeposit' },
  { key: 'totalAssetsUpdatedEvents', fields: 'id totalAssets blockTimestamp transactionHash', type: 'totalAssetsUpdated' },
  { key: 'highWaterMarkUpdatedEvents', fields: 'id oldHighWaterMark newHighWaterMark blockTimestamp transactionHash', type: 'highWaterMarkUpdated' },
  { key: 'withdrawEvents', fields: 'id sender receiver owner assets shares blockNumber blockTimestamp transactionHash', type: 'withdraw' },
];

async function syncEvents() {
  const timestamp = new Date().toISOString();
  const summary: { [eventType: string]: number } = {};
  try {
    let allDocuments: any[] = [];
    for (const eventType of eventTypes) {
      let usedEndpoint = 'unknown';
      // Patch: intercept endpoint used by requestWithFallback
      const origConsoleInfo = console.info;
      console.info = (msg: string) => {
        if (msg.startsWith('[Subgraph] Successfully fetched from endpoint:')) {
          usedEndpoint = msg.replace('[Subgraph] Successfully fetched from endpoint: ', '').trim();
        }
        origConsoleInfo(msg);
      };
      // 1. Read the last blockTimestamp from the database
      const syncState = await SyncState.findOne({ eventType: eventType.key });
      const lastBlockTimestamp = syncState ? syncState.lastBlockTimestamp : undefined;
      // 2. Fetch the latest event from the subgraph for this type
      const latestEvent = await fetchLatestEvent(eventType.key, eventType.fields);
      const lastBlockSubgraph = latestEvent ? latestEvent.blockTimestamp : null;
      const lastBlockMongo = lastBlockTimestamp || null;
      let logBlock = `========== [${eventType.key}] ==========`;
      if (!latestEvent) {
        logBlock += `\nNo events found in subgraph (may be empty or not indexed)`;
        logBlock += `\nUsed endpoint: ${usedEndpoint}`;
        logBlock += `\n===========================================`;
        console.log(logBlock);
        summary[eventType.key] = 0;
        console.info = origConsoleInfo;
        continue;
      }
      logBlock += `\nLast block in subgraph: ${lastBlockSubgraph}`;
      logBlock += `\nLast block in MongoDB: ${lastBlockMongo}`;
      if (latestEvent.blockTimestamp === lastBlockTimestamp) {
        logBlock += `\nAction: No new events to add`;
        logBlock += `\nUsed endpoint: ${usedEndpoint}`;
        logBlock += `\n===========================================`;
        console.log(logBlock);
        summary[eventType.key] = 0;
        console.info = origConsoleInfo;
        continue;
      }
      // 3. Otherwise, fetch missing events (those after lastBlockTimestamp)
      const newEvents = await fetchEventsAfter(eventType.key, eventType.fields, lastBlockTimestamp);
      let docs: any[] = [];
      if (Array.isArray(newEvents) && newEvents.length > 0) {
        docs = newEvents
          .filter(e => typeof e === 'object' && e !== null)
          .map(e => ({ ...(e as object), type: eventType.type }));
        allDocuments = allDocuments.concat(docs);
        // Update the last blockTimestamp
        const lastEvent = newEvents[newEvents.length - 1];
        if (lastEvent && typeof lastEvent === 'object' && 'blockTimestamp' in lastEvent) {
          await SyncState.updateOne(
            { eventType: eventType.key },
            { $set: { lastBlockTimestamp: (lastEvent as any).blockTimestamp } },
            { upsert: true }
          );
        }
        logBlock += `\nAction: Adding ${docs.length} new events to MongoDB`;
        summary[eventType.key] = docs.length;
      } else {
        logBlock += `\nAction: No new events to add (fetchEventsAfter returned empty)`;
        summary[eventType.key] = 0;
      }
      logBlock += `\nUsed endpoint: ${usedEndpoint}`;
      logBlock += `\n===========================================`;
      console.log(logBlock);
      console.info = origConsoleInfo;
    }
    // Insert all documents at once
    if (allDocuments.length > 0) {
      await Event.insertMany(allDocuments, { ordered: false });
      console.log(`[${timestamp}] All new events have been successfully inserted`);
    } else {
      console.log(`[${timestamp}] No new events to insert`);
    }
    // Print summary
    console.log('\nSummary:');
    for (const eventType of eventTypes) {
      console.log(`${eventType.key}: ${summary[eventType.key] || 0} new events`);
    }
  } catch (error) {
    console.error(`[${timestamp}] Error while syncing events:`, error);
  }
}

export async function main() {
  await connectToMongoDB();
  await syncEvents();
}

// Appel direct si lancé en CLI
if (require.main === module) {
  main().catch(console.error);
}