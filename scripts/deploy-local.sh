#!/bin/bash

# Mindy - Local Contract Deployment Script
# Deploys to local anvil or specified RPC

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CONTRACTS_DIR="$PROJECT_ROOT/contracts"

cd "$CONTRACTS_DIR"

echo "🚀 Mindy Contract Deployment"
echo "============================"
echo ""

# Check for RPC URL
RPC_URL="${RPC_URL:-http://localhost:8545}"
CHAIN_ID="${CHAIN_ID:-31337}"

echo "📡 RPC URL: $RPC_URL"
echo "🔗 Chain ID: $CHAIN_ID"
echo ""

# Check if anvil is running
if ! curl -s "$RPC_URL" > /dev/null 2>&1; then
    echo "⚠️  No RPC endpoint detected at $RPC_URL"
    echo ""
    echo "Starting local anvil node..."
    echo ""
    
    # Start anvil in background
    anvil --port 8545 --chain-id $CHAIN_ID &
    ANVIL_PID=$!
    
    # Wait for anvil to start
    sleep 3
    
    # Use anvil's default account
    PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    UNDERLYING_TOKEN="0x0000000000000000000000000000000000000000"  # Will deploy mock
    
    echo "✅ Anvil started (PID: $ANVIL_PID)"
    echo ""
    
    cleanup() {
        echo ""
        echo "🛑 Stopping anvil..."
        kill $ANVIL_PID 2>/dev/null || true
    }
    trap cleanup EXIT
else
    echo "✅ RPC endpoint detected"
    echo ""
    
    # Require env vars for remote deployment
    if [ -z "$PRIVATE_KEY" ]; then
        echo "❌ PRIVATE_KEY not set"
        echo "   Export your private key: export PRIVATE_KEY=0x..."
        exit 1
    fi
    
    if [ -z "$UNDERLYING_TOKEN" ]; then
        echo "❌ UNDERLYING_TOKEN not set"
        echo "   Export token address: export UNDERLYING_TOKEN=0x..."
        exit 1
    fi
fi

# Compile if needed
if [ ! -d "out" ]; then
    echo "🔨 Compiling contracts..."
    forge build
    echo ""
fi

echo "📦 Deploying contracts..."
echo ""

# Deploy
export RPC_URL
export PRIVATE_KEY
export UNDERLYING_TOKEN

forge script script/Deploy.s.sol \
    --rpc-url "$RPC_URL" \
    --broadcast \
    -vvvv

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Check broadcast/ for deployment artifacts"
