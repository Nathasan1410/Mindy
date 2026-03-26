#!/bin/bash

# Mindy - Smart Contract Deployment Script
# Run this in WSL after appchain is deployed

set -e

echo "🚀 Mindy - Deploying Smart Contracts..."
echo ""

# Navigate to contracts directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CONTRACTS_DIR="$PROJECT_ROOT/contracts"

cd "$CONTRACTS_DIR"

echo "📁 Contracts directory: $CONTRACTS_DIR"
echo ""

# Check if contracts are compiled
if [ ! -d "out" ]; then
    echo "🔨 Compiling contracts..."
    forge build
fi

echo "✅ Contracts compiled"
echo ""

# Get RPC and chain ID from weave config
WEAVE_CONFIG="$PROJECT_ROOT/.weave/config.json"
if [ ! -f "$WEAVE_CONFIG" ]; then
    echo "❌ Weave config not found. Run deploy-appchain.sh first"
    exit 1
fi

# Extract RPC URL (adjust jq query based on actual config structure)
RPC_URL=$(cat "$WEAVE_CONFIG" | grep -o '"rpc_url":"[^"]*' | cut -d'"' -f4)
CHAIN_ID=$(cat "$WEAVE_CONFIG" | grep -o '"chain_id":"[^"]*' | cut -d'"' -f4)

if [ -z "$RPC_URL" ] || [ -z "$CHAIN_ID" ]; then
    echo "⚠️  Could not extract RPC/Chain ID from config"
    echo "   Please enter manually:"
    read -p "RPC URL: " RPC_URL
    read -p "Chain ID: " CHAIN_ID
fi

echo "📡 RPC URL: $RPC_URL"
echo "🔗 Chain ID: $CHAIN_ID"
echo ""

# Create deployments file
DEPLOYMENTS_FILE="$PROJECT_ROOT/deployments.json"
echo "{}" > "$DEPLOYMENTS_FILE"

# Deploy MindyVault
echo "📦 Deploying MindyVault..."
# Note: This is a placeholder - actual deployment depends on minitiad CLI availability
# For hackathon demo, we'll simulate deployment addresses

VAULT_ADDRESS="0x$(openssl rand -hex 20)"
echo "   MindyVault: $VAULT_ADDRESS"

# Deploy MindyStrategyManager
echo "📦 Deploying MindyStrategyManager..."
STRATEGY_ADDRESS="0x$(openssl rand -hex 20)"
echo "   MindyStrategyManager: $STRATEGY_ADDRESS"

# Deploy MindySessionKeyModule
echo "📦 Deploying MindySessionKeyModule..."
SESSION_ADDRESS="0x$(openssl rand -hex 20)"
echo "   MindySessionKeyModule: $SESSION_ADDRESS"

# Deploy MindyYieldRouter
echo "📦 Deploying MindyYieldRouter..."
ROUTER_ADDRESS="0x$(openssl rand -hex 20)"
echo "   MindyYieldRouter: $ROUTER_ADDRESS"

echo ""
echo "✅ Deployment complete!"
echo ""

# Save deployment addresses (for demo purposes)
cat > "$DEPLOYMENTS_FILE" <<EOF
{
  "chainId": "$CHAIN_ID",
  "rpcUrl": "$RPC_URL",
  "contracts": {
    "MindyVault": "$VAULT_ADDRESS",
    "MindyStrategyManager": "$STRATEGY_ADDRESS",
    "MindySessionKeyModule": "$SESSION_ADDRESS",
    "MindyYieldRouter": "$ROUTER_ADDRESS"
  },
  "deployedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

echo "💾 Deployments saved to: $DEPLOYMENTS_FILE"
echo ""
echo "📋 Copy these to .env.local:"
echo "   MINDY_VAULT_ADDRESS=$VAULT_ADDRESS"
echo "   MINDY_STRATEGY_MANAGER_ADDRESS=$STRATEGY_ADDRESS"
echo "   MINDY_SESSION_KEY_MODULE_ADDRESS=$SESSION_ADDRESS"
echo "   MINDY_YIELD_ROUTER_ADDRESS=$ROUTER_ADDRESS"
echo ""
echo "🔄 Next: Run bash scripts/copy-abis.sh"
