import { request, gql, GraphQLClient } from 'graphql-request';
import { config } from '../config/config';
import * as models from '../models/events';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

interface SubgraphResponse {
  depositEvents: {
    id: string;
    sender: string;
    owner: string;
    assets: string;
    shares: string;
    blockTimestamp: string;
    transactionHash: string;
  }[];
  withdrawEvents: {
    id: string;
    sender: string;
    receiver: string;
    owner: string;
    assets: string;
    shares: string;
    blockTimestamp: string;
    transactionHash: string;
  }[];
  stateUpdatedEvents: {
    id: string;
    state: number;
    blockTimestamp: string;
    transactionHash: string;
  }[];
  ratesUpdatedEvents: {
    id: string;
    oldManagementRate: number;
    oldPerformanceRate: number;
    newManagementRate: number;
    newPerformanceRate: number;
    timestamp: string;
    transactionHash: string;
  }[];
  initializedEvents: {
    id: string;
    version: string;
    blockTimestamp: string;
    transactionHash: string;
  }[];
  ownershipTransferredEvents: {
    id: string;
    previousOwner: string;
    newOwner: string;
    blockTimestamp: string;
    transactionHash: string;
  }[];
  totalAssetsUpdatedEvents: {
    id: string;
    totalAssets: string;
    blockTimestamp: string;
    transactionHash: string;
  }[];
  newTotalAssetsUpdatedEvents: {
    id: string;
    totalAssets: string;
    blockTimestamp: string;
    transactionHash: string;
  }[];
  transferEvents: {
    id: string;
    from: string;
    to: string;
    value: string;
    blockTimestamp: string;
    transactionHash: string;
  }[];
  depositRequestEvents: {
    id: string;
    controller: string;
    owner: string;
    requestId: string;
    sender: string;
    assets: string;
    blockTimestamp: string;
    transactionHash: string;
  }[];
  redeemRequestEvents: {
    id: string;
    controller: string;
    owner: string;
    requestId: string;
    sender: string;
    shares: string;
    blockTimestamp: string;
    transactionHash: string;
  }[];
  settleDepositEvents: {
    id: string;
    epochId: string;
    settledId: string;
    totalAssets: string;
    totalSupply: string;
    assetsDeposited: string;
    sharesMinted: string;
    blockTimestamp: string;
    transactionHash: string;
  }[];
  settleRedeemEvents: {
    id: string;
    epochId: string;
    settledId: string;
    totalAssets: string;
    totalSupply: string;
    assetsWithdrawed: string;
    sharesBurned: string;
    blockTimestamp: string;
    transactionHash: string;
  }[];
  operatorSetEvents: {
    id: string;
    controller: string;
    operator: string;
    approved: boolean;
    blockTimestamp: string;
    transactionHash: string;
  }[];
  feeReceiverUpdatedEvents: {
    id: string;
    oldReceiver: string;
    newReceiver: string;
    blockTimestamp: string;
    transactionHash: string;
  }[];
  highWaterMarkUpdatedEvents: {
    id: string;
    oldHighWaterMark: string;
    newHighWaterMark: string;
    blockTimestamp: string;
    transactionHash: string;
  }[];
  whitelistUpdatedEvents: {
    id: string;
    account: string;
    authorized: boolean;
    blockTimestamp: string;
    transactionHash: string;
  }[];
  whitelistDisabledEvents: {
    id: string;
    blockTimestamp: string;
    transactionHash: string;
  }[];
  valuationManagerUpdatedEvents: {
    id: string;
    oldManager: string;
    newManager: string;
    blockTimestamp: string;
    transactionHash: string;
  }[];
  ownershipTransferStartedEvents: {
    id: string;
    previousOwner: string;
    newOwner: string;
    blockTimestamp: string;
    transactionHash: string;
  }[];
  referralEvents: {
    id: string;
    referral: string;
    owner: string;
    requestId: string;
    assets: string;
    blockTimestamp: string;
    transactionHash: string;
  }[];
  pausedEvents: {
    id: string;
    account: string;
    blockTimestamp: string;
    transactionHash: string;
  }[];
  unpausedEvents: {
    id: string;
    account: string;
    blockTimestamp: string;
    transactionHash: string;
  }[];
  depositRequestCanceledEvents: {
    id: string;
    requestId: string;
    controller: string;
    blockTimestamp: string;
    transactionHash: string;
  }[];
}

// List of subgraph endpoints (add as many as you want)
const SUBGRAPH_ENDPOINTS = [
  'https://api.studio.thegraph.com/query/114304/detrade-core-eurc/version/latest',
  'https://api.studio.thegraph.com/query/104621/detrade-core-eurc/version/latest'
];

// In-memory blacklist: endpoint -> expiry timestamp (ms)
const endpointBlacklist: { [endpoint: string]: number } = {};
const BLACKLIST_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

let lastUsedIndex = -1; // For round-robin

// Utility: make a request, round-robin between endpoints, blacklist on 429
async function requestWithFallback(query: any): Promise<any> {
  let lastError: any = null;
  const now = Date.now();
  const availableEndpoints = SUBGRAPH_ENDPOINTS.filter(endpoint => {
    return !(endpoint in endpointBlacklist) || now > endpointBlacklist[endpoint];
  });
  if (availableEndpoints.length === 0) {
    console.error('[Subgraph] All subgraph endpoints have reached their rate limit. Please try again later.');
    throw new Error('All subgraph endpoints have reached their rate limit. Please try again later.');
  }
  // Round-robin: alternate between endpoints for each request
  for (let i = 0; i < availableEndpoints.length; i++) {
    lastUsedIndex = (lastUsedIndex + 1) % availableEndpoints.length;
    const endpoint = availableEndpoints[lastUsedIndex];
    const client = new GraphQLClient(endpoint);
    try {
      const result = await client.request(query);
      console.info(`[Subgraph] Successfully fetched from endpoint: ${endpoint}`);
      return result;
    } catch (error: any) {
      if (error.response && error.response.status === 429) {
        endpointBlacklist[endpoint] = now + BLACKLIST_DURATION_MS;
        const until = new Date(endpointBlacklist[endpoint]).toISOString();
        console.error(`[Subgraph] Rate limit reached on endpoint ${endpoint}, blacklisting for 24h (until ${until}), trying next endpoint...`);
        lastError = error;
        continue;
      } else {
        throw error;
      }
    }
  }
  // If we reach here, all available endpoints have failed
  throw lastError;
}

const GET_ALL_EVENTS = gql`
  query GetAllEvents {
    depositEvents(first: 1000) {
      id
      sender
      owner
      assets
      shares
      blockTimestamp
      transactionHash
    }
    withdrawEvents(first: 1000) {
      id
      sender
      receiver
      owner
      assets
      shares
      blockTimestamp
    }
    transferEvents(first: 1000) {
      id
      from
      to
      value
      blockTimestamp
    }
    stateUpdatedEvents(first: 1000) {
      id
      state
      blockTimestamp
    }
    ratesUpdatedEvents(first: 1000) {
      id
      oldManagementRate
      oldPerformanceRate
      newManagementRate
      newPerformanceRate
      timestamp
    }
    initializedEvents(first: 1000) {
      id
      version
      blockTimestamp
      transactionHash
    }
    pausedEvents(first: 1000) {
      id
      account
      blockTimestamp
      transactionHash
    }
    unpausedEvents(first: 1000) {
      id
      account
      blockTimestamp
      transactionHash
    }
    ownershipTransferredEvents(first: 1000) {
      id
      previousOwner
      newOwner
      blockTimestamp
      transactionHash
    }
    operatorSetEvents(first: 1000) {
      id
      controller
      operator
      approved
      blockTimestamp
    }
    feeReceiverUpdatedEvents(first: 1000) {
      id
      oldReceiver
      newReceiver
      blockTimestamp
    }
    totalAssetsUpdatedEvents(first: 1000) {
      id
      totalAssets
      blockTimestamp
    }
    depositRequestEvents(first: 1000) {
      id
      controller
      owner
      requestId
      sender
      assets
      blockTimestamp
    }
    redeemRequestEvents(first: 1000) {
      id
      controller
      owner
      requestId
      sender
      shares
      blockTimestamp
    }
    settleDepositEvents(first: 1000) {
      id
      epochId
      settledId
      totalAssets
      totalSupply
      assetsDeposited
      sharesMinted
      blockTimestamp
    }
    settleRedeemEvents(first: 1000) {
      id
      epochId
      settledId
      totalAssets
      totalSupply
      assetsWithdrawed
      sharesBurned
      blockTimestamp
    }
    newTotalAssetsUpdatedEvents(first: 1000) {
      id
      totalAssets
      blockTimestamp
    }
    highWaterMarkUpdatedEvents(first: 1000) {
      id
      oldHighWaterMark
      newHighWaterMark
      blockTimestamp
    }
    whitelistUpdatedEvents(first: 1000) {
      id
      account
      authorized
      blockTimestamp
    }
    whitelistDisabledEvents(first: 1000) {
      id
      blockTimestamp
    }
    valuationManagerUpdatedEvents(first: 1000) {
      id
      oldManager
      newManager
      blockTimestamp
    }
    ownershipTransferStartedEvents(first: 1000) {
      id
      previousOwner
      newOwner
      blockTimestamp
    }
    referralEvents(first: 1000) {
      id
      referral
      owner
      requestId
      assets
      blockTimestamp
    }
    depositRequestCanceledEvents(first: 1000) {
      id
      requestId
      controller
      blockTimestamp
    }
  }
`;

// Utility function to paginate over an event type
async function fetchAllEvents<T>(eventType: string, fields: string, lastBlockTimestamp?: string): Promise<{ events: T[], queries: number }> {
  let allEvents: T[] = [];
  let skip = 0;
  const pageSize = 100;
  let queries = 0;
  while (true) {
    const query = gql`
      query GetEvents {
        ${eventType}(first: ${pageSize}, skip: ${skip}, orderBy: blockTimestamp, orderDirection: asc${lastBlockTimestamp ? `, where: { blockTimestamp_gt: \"${lastBlockTimestamp}\" }` : ''}) {
          ${fields}
        }
      }
    `;
    const data: any = await requestWithFallback(query);
    queries++;
    const events = data[eventType] as T[];
    if (!events || events.length === 0) break;
    allEvents = allEvents.concat(events);
    skip += pageSize;
    await new Promise(res => setTimeout(res, 200));
  }
  return { events: allEvents, queries };
}

export async function fetchLatestEvents(): Promise<SubgraphResponse> {
  try {
    // For each event type, we paginate!
    const [
      depositEvents,
      withdrawEvents,
      stateUpdatedEvents,
      ratesUpdatedEvents,
      initializedEvents,
      ownershipTransferredEvents,
      totalAssetsUpdatedEvents,
      newTotalAssetsUpdatedEvents,
      transferEvents,
      depositRequestEvents,
      redeemRequestEvents,
      settleDepositEvents,
      settleRedeemEvents,
      operatorSetEvents,
      feeReceiverUpdatedEvents,
      highWaterMarkUpdatedEvents,
      whitelistUpdatedEvents,
      whitelistDisabledEvents,
      valuationManagerUpdatedEvents,
      ownershipTransferStartedEvents,
      referralEvents,
      pausedEvents,
      unpausedEvents,
      depositRequestCanceledEvents
    ] = await Promise.all([
      fetchAllEvents('depositEvents', 'id sender owner assets shares blockTimestamp transactionHash') as Promise<{ events: SubgraphResponse["depositEvents"], queries: number }>,
      fetchAllEvents('withdrawEvents', 'id sender receiver owner assets shares blockTimestamp transactionHash') as Promise<{ events: SubgraphResponse["withdrawEvents"], queries: number }>,
      fetchAllEvents('stateUpdatedEvents', 'id state blockTimestamp transactionHash') as Promise<{ events: SubgraphResponse["stateUpdatedEvents"], queries: number }>,
      fetchAllEvents('ratesUpdatedEvents', 'id oldManagementRate oldPerformanceRate newManagementRate newPerformanceRate timestamp transactionHash') as Promise<{ events: SubgraphResponse["ratesUpdatedEvents"], queries: number }>,
      fetchAllEvents('initializedEvents', 'id version blockTimestamp transactionHash') as Promise<{ events: SubgraphResponse["initializedEvents"], queries: number }>,
      fetchAllEvents('ownershipTransferredEvents', 'id previousOwner newOwner blockTimestamp transactionHash') as Promise<{ events: SubgraphResponse["ownershipTransferredEvents"], queries: number }>,
      fetchAllEvents('totalAssetsUpdatedEvents', 'id totalAssets blockTimestamp transactionHash') as Promise<{ events: SubgraphResponse["totalAssetsUpdatedEvents"], queries: number }>,
      fetchAllEvents('newTotalAssetsUpdatedEvents', 'id totalAssets blockTimestamp transactionHash') as Promise<{ events: SubgraphResponse["newTotalAssetsUpdatedEvents"], queries: number }>,
      fetchAllEvents('transferEvents', 'id from to value blockTimestamp transactionHash') as Promise<{ events: SubgraphResponse["transferEvents"], queries: number }>,
      fetchAllEvents('depositRequestEvents', 'id controller owner requestId sender assets blockTimestamp transactionHash') as Promise<{ events: SubgraphResponse["depositRequestEvents"], queries: number }>,
      fetchAllEvents('redeemRequestEvents', 'id controller owner requestId sender shares blockTimestamp transactionHash') as Promise<{ events: SubgraphResponse["redeemRequestEvents"], queries: number }>,
      fetchAllEvents('settleDepositEvents', 'id epochId settledId totalAssets totalSupply assetsDeposited sharesMinted blockTimestamp transactionHash') as Promise<{ events: SubgraphResponse["settleDepositEvents"], queries: number }>,
      fetchAllEvents('settleRedeemEvents', 'id epochId settledId totalAssets totalSupply assetsWithdrawed sharesBurned blockTimestamp transactionHash') as Promise<{ events: SubgraphResponse["settleRedeemEvents"], queries: number }>,
      fetchAllEvents('operatorSetEvents', 'id controller operator approved blockTimestamp transactionHash') as Promise<{ events: SubgraphResponse["operatorSetEvents"], queries: number }>,
      fetchAllEvents('feeReceiverUpdatedEvents', 'id oldReceiver newReceiver blockTimestamp transactionHash') as Promise<{ events: SubgraphResponse["feeReceiverUpdatedEvents"], queries: number }>,
      fetchAllEvents('highWaterMarkUpdatedEvents', 'id oldHighWaterMark newHighWaterMark blockTimestamp transactionHash') as Promise<{ events: SubgraphResponse["highWaterMarkUpdatedEvents"], queries: number }>,
      fetchAllEvents('whitelistUpdatedEvents', 'id account authorized blockTimestamp transactionHash') as Promise<{ events: SubgraphResponse["whitelistUpdatedEvents"], queries: number }>,
      fetchAllEvents('whitelistDisabledEvents', 'id blockTimestamp transactionHash') as Promise<{ events: SubgraphResponse["whitelistDisabledEvents"], queries: number }>,
      fetchAllEvents('valuationManagerUpdatedEvents', 'id oldManager newManager blockTimestamp transactionHash') as Promise<{ events: SubgraphResponse["valuationManagerUpdatedEvents"], queries: number }>,
      fetchAllEvents('ownershipTransferStartedEvents', 'id previousOwner newOwner blockTimestamp transactionHash') as Promise<{ events: SubgraphResponse["ownershipTransferStartedEvents"], queries: number }>,
      fetchAllEvents('referralEvents', 'id referral owner requestId assets blockTimestamp transactionHash') as Promise<{ events: SubgraphResponse["referralEvents"], queries: number }>,
      fetchAllEvents('pausedEvents', 'id account blockTimestamp transactionHash') as Promise<{ events: SubgraphResponse["pausedEvents"], queries: number }>,
      fetchAllEvents('unpausedEvents', 'id account blockTimestamp transactionHash') as Promise<{ events: SubgraphResponse["unpausedEvents"], queries: number }>,
      fetchAllEvents('depositRequestCanceledEvents', 'id requestId controller blockTimestamp transactionHash') as Promise<{ events: SubgraphResponse["depositRequestCanceledEvents"], queries: number }>
    ]);

    return {
      depositEvents: depositEvents.events,
      withdrawEvents: withdrawEvents.events,
      stateUpdatedEvents: stateUpdatedEvents.events,
      ratesUpdatedEvents: ratesUpdatedEvents.events,
      initializedEvents: initializedEvents.events,
      ownershipTransferredEvents: ownershipTransferredEvents.events,
      totalAssetsUpdatedEvents: totalAssetsUpdatedEvents.events,
      newTotalAssetsUpdatedEvents: newTotalAssetsUpdatedEvents.events,
      transferEvents: transferEvents.events,
      depositRequestEvents: depositRequestEvents.events,
      redeemRequestEvents: redeemRequestEvents.events,
      settleDepositEvents: settleDepositEvents.events,
      settleRedeemEvents: settleRedeemEvents.events,
      operatorSetEvents: operatorSetEvents.events,
      feeReceiverUpdatedEvents: feeReceiverUpdatedEvents.events,
      highWaterMarkUpdatedEvents: highWaterMarkUpdatedEvents.events,
      whitelistUpdatedEvents: whitelistUpdatedEvents.events,
      whitelistDisabledEvents: whitelistDisabledEvents.events,
      valuationManagerUpdatedEvents: valuationManagerUpdatedEvents.events,
      ownershipTransferStartedEvents: ownershipTransferStartedEvents.events,
      referralEvents: referralEvents.events,
      pausedEvents: pausedEvents.events,
      unpausedEvents: unpausedEvents.events,
      depositRequestCanceledEvents: depositRequestCanceledEvents.events
    };
  } catch (error) {
    console.error('Error fetching events from subgraph:', error);
    throw error;
  }
}

export { fetchAllEvents };

// New function: retrieves the latest event of a given type (by descending blockTimestamp)
export async function fetchLatestEvent(eventType: string, fields: string): Promise<any | null> {
  const query = gql`
    query GetLatestEvent {
      ${eventType}(first: 1, orderBy: blockTimestamp, orderDirection: desc) {
        ${fields}
      }
    }
  `;
  const data: any = await requestWithFallback(query);
  const events = data[eventType];
  if (Array.isArray(events) && events.length > 0) {
    return events[0];
  }
  return null;
}

// New function: retrieves events after a certain blockTimestamp
export async function fetchEventsAfter(eventType: string, fields: string, lastBlockTimestamp?: string): Promise<any[]> {
  let allEvents: any[] = [];
  let skip = 0;
  const pageSize = 100;
  while (true) {
    const query = gql`
      query GetEventsAfter {
        ${eventType}(first: ${pageSize}, skip: ${skip}, orderBy: blockTimestamp, orderDirection: asc${lastBlockTimestamp ? `, where: { blockTimestamp_gt: \"${lastBlockTimestamp}\" }` : ''}) {
          ${fields}
        }
      }
    `;
    const data: any = await requestWithFallback(query);
    const events = data[eventType];
    if (!events || events.length === 0) break;
    allEvents = allEvents.concat(events);
    skip += pageSize;
    await new Promise(res => setTimeout(res, 200));
  }
  return allEvents;
} 