require('dotenv').config({ path: '../../.env' });
require('ts-node/register');

(async () => {
  try {
    const index = require('./src/index.ts');
    if (typeof index.main === 'function') {
      await index.main();
    } else if (typeof index.default === 'function') {
      await index.default();
    } else {
      throw new Error('No main function exported from src/index.ts');
    }
    console.log('Sync done (one shot)');
    process.exit(0);
  } catch (err) {
    console.error('Sync failed:', err);
    process.exit(1);
  }
})(); 