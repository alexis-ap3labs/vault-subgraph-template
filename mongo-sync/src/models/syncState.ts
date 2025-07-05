import mongoose from 'mongoose';

const syncStateSchema = new mongoose.Schema({
  eventType: { type: String, required: true, unique: true },
  lastBlockTimestamp: { type: String, required: true }
});

export const SyncState = mongoose.model('SyncState', syncStateSchema, 'sync_state'); 