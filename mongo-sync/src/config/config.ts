import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the .env file
const envPath = path.resolve(__dirname, '../../../.env');
console.log('Looking for .env file at:', envPath);
dotenv.config({ path: envPath });

// Check that required environment variables are present
const requiredEnvVars = [
  'MONGODB_URI',
  'MONGODB_DB_NAME',
  'MONGODB_COLLECTION_NAME',
];

// Check each required variable
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Export configuration
export const config = {
  subgraph: {
    url: 'https://gateway.thegraph.com/api/subgraphs/id/J9HeYRghgXxcVj5n3idoe9entd2EzVb3MwcTimQSAL56',
  },
  mongodb: {
    uri: process.env.MONGODB_URI!,
    dbName: process.env.MONGODB_DB_NAME!,
    collectionName: process.env.MONGODB_COLLECTION_NAME!
  }
}; 