#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { execSync } = require('child_process');

// Read configuration
const configPath = path.join(__dirname, '..', 'config.yaml');
const config = yaml.load(fs.readFileSync(configPath, 'utf8'));

console.log(`🚀 Starting deployment...`);
console.log(`📋 Configuration:`);
console.log(`   - Network: ${config.network}`);
console.log(`   - Contract: ${config.contractAddress}`);
console.log(`   - Subgraph Name: ${config.subgraphName}`);

// Validate configuration
if (!config.subgraphName || config.subgraphName === 'your-subgraph-name') {
  console.error(`❌ Error: Please update 'subgraphName' in config.yaml with your actual subgraph name`);
  console.error(`   Example: "detrade-core-eurc"`);
  process.exit(1);
}

if (!config.deployKey || config.deployKey === 'your-deploy-key') {
  console.error(`❌ Error: Please update 'deployKey' in config.yaml with your actual deploy key`);
  console.error(`   Get your deploy key from: https://thegraph.com/studio/apikeys`);
  process.exit(1);
}

try {
  // Build the subgraph first
  console.log(`🔨 Building subgraph...`);
  execSync('graph build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  
  // Authenticate with The Graph
  console.log(`🔐 Authenticating with The Graph...`);
  const authCommand = `graph auth ${config.deployKey}`;
  execSync(authCommand, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  
  // Deploy to The Graph
  console.log(`📤 Deploying to The Graph...`);
  const deployCommand = `graph deploy --node https://api.studio.thegraph.com/deploy/ ${config.subgraphName}`;
  execSync(deployCommand, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  
  console.log(`✅ Deployment completed!`);
  console.log(`🌐 Your subgraph: https://thegraph.com/hosted-service/${config.subgraphName}`);
  
} catch (error) {
  console.error(`❌ Deployment failed:`, error.message);
  process.exit(1);
} 