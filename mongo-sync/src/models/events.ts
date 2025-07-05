import mongoose from 'mongoose';
import { config } from '../config/config';

// Event schema definition
const eventSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  blockTimestamp: { type: String },
  transactionHash: { type: String },
  // Common fields
  sender: { type: String },
  owner: { type: String },
  assets: { type: String },
  shares: { type: String },
  // Specific fields
  receiver: { type: String },
  from: { type: String },
  to: { type: String },
  value: { type: String },
  state: { type: Number },
  oldManagementRate: { type: Number },
  oldPerformanceRate: { type: Number },
  newManagementRate: { type: Number },
  newPerformanceRate: { type: Number },
  timestamp: { type: String },
  version: { type: String },
  account: { type: String },
  previousOwner: { type: String },
  newOwner: { type: String },
  controller: { type: String },
  operator: { type: String },
  approved: { type: Boolean },
  oldReceiver: { type: String },
  newReceiver: { type: String },
  totalAssets: { type: String },
  requestId: { type: String },
  epochId: { type: String },
  settledId: { type: String },
  totalSupply: { type: String },
  assetsDeposited: { type: String },
  sharesMinted: { type: String },
  assetsWithdrawed: { type: String },
  sharesBurned: { type: String },
  oldHighWaterMark: { type: String },
  newHighWaterMark: { type: String },
  authorized: { type: Boolean },
  oldManager: { type: String },
  newManager: { type: String },
  referral: { type: String }
}, { timestamps: true });

// Create the model
export const Event = mongoose.model('Event', eventSchema, config.mongodb.collectionName); 