#!/usr/bin/env node
// contracts/scripts/sync-contracts.js
// Syncs OpenAPI spec from backend to contracts package

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BACKEND_PATH = path.join(__dirname, '../../backend');
const CONTRACTS_PATH = __dirname;

console.log('🔄 Syncing API contracts...');

try {
  // 1. Generate OpenAPI from Laravel backend
  console.log('📝 Generating OpenAPI spec from Laravel...');
  execSync('php artisan openapi:generate --output=../contracts/openapi.yaml', {
    cwd: BACKEND_PATH,
    stdio: 'inherit'
  });

  // 2. Generate TypeScript types
  console.log('🔧 Generating TypeScript types...');
  execSync('npx openapi-typescript openapi.yaml -o types/api.d.ts', {
    cwd: CONTRACTS_PATH,
    stdio: 'inherit'
  });

  // 3. Generate Zod schemas
  console.log('🔧 Generating Zod validation schemas...');
  execSync('npx openapi-zod openapi.yaml -o schemas/', {
    cwd: CONTRACTS_PATH,
    stdio: 'inherit'
  });

  // 4. Copy websocket types (manual source of truth)
  const wsTypesSrc = path.join(CONTRACTS_PATH, 'types/websocket.d.ts');
  const wsTypesDest = path.join(CONTRACTS_PATH, 'types/websocket.d.ts');
  if (fs.existsSync(wsTypesSrc)) {
    console.log('📋 WebSocket types already in place (manual source of truth)');
  }

  console.log('✅ Contracts synced successfully!');
  console.log('📁 Generated:');
  console.log('   - contracts/openapi.yaml');
  console.log('   - contracts/types/api.d.ts');
  console.log('   - contracts/types/websocket.d.ts (manual)');
  console.log('   - contracts/schemas/*.json');

} catch (error) {
  console.error('❌ Contract sync failed:', error.message);
  process.exit(1);
}