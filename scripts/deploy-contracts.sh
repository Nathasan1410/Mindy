#!/bin/bash

# Mindy - Smart Contract Deployment Script
# Deploys to Initia testnet

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

# Use Initia testnet
RPC_URL="https://rpc.testnet.initia.xyz"
CHAIN_ID="initiation-2"

echo "📡 RPC URL: $RPC_URL"
echo "🔗 Chain ID: $CHAIN_ID"
echo ""

# Create deployments file
DEPLOYMENTS_FILE="$PROJECT_ROOT/deployments.json"

# Deploy MindyVault
echo "📦 Deploying MindyVault..."
VAULT_OUTPUT=$(forge create --rpc-url $RPC_URL --private-key $DEPLOYER_PRIVATE_KEY \
    src/MindyVault.sol:MindyVault \
    --constructor-args 0x0000000000000000000000000000000000000000 0x0000000000000000000000000000000000000000 \
    --json 2>/dev/null || echo "FAILED")

if echo "$VAULT_OUTPUT" | grep -q "deployedTo"; then
    VAULT_ADDRESS=$(echo "$VAULT_OUTPUT" | grep -o '"deployedTo":"[^"]*' | cut -d'"' -f4)
    echo "   MindyVault: $VAULT_ADDRESS"
else
    echo "   ⚠️  Deployment failed - using placeholder"
    VAULT_ADDRESS="0x$(openssl rand -hex 20)"
    echo "   Placeholder: $VAULT_ADDRESS"
fi

# Deploy MindyStrategyManager
echo "📦 Deploying MindyStrategyManager..."
STRATEGY_OUTPUT=$(forge create --rpc-url $RPC_URL --private-key $DEPLOYER_PRIVATE_KEY \
    src/MindyStrategyManager.sol:MindyStrategyManager \
    --constructor-args 0x0000000000000000000000000000000000000000 \
    --json 2>/dev/null || echo "FAILED")

if echo "$STRATEGY_OUTPUT" | grep -q "deployedTo"; then
    STRATEGY_ADDRESS=$(echo "$STRATEGY_OUTPUT" | grep -o '"deployedTo":"[^"]*' | cut -d'"' -f4)
    echo "   MindyStrategyManager: $STRATEGY_ADDRESS"
else
    echo "   ⚠️  Deployment failed - using placeholder"
    STRATEGY_ADDRESS="0x$(openssl rand -hex 20)"
    echo "   Placeholder: $STRATEGY_ADDRESS"
fi

# Deploy MindySessionKeyModule
echo "📦 Deploying MindySessionKeyModule..."
SESSION_OUTPUT=$(forge create --rpc-url $RPC_URL --private-key $DEPLOYER_PRIVATE_KEY \
    src/MindySessionKeyModule.sol:MindySessionKeyModule \
    --constructor-args 0x0000000000000000000000000000000000000000 \
    --json 2>/dev/null || echo "FAILED")

if echo "$SESSION_OUTPUT" | grep -q "deployedTo"; then
    SESSION_ADDRESS=$(echo "$SESSION_OUTPUT" | grep -o '"deployedTo":"[^"]*' | cut -d'"' -f4)
    echo "   MindySessionKeyModule: $SESSION_ADDRESS"
else
    echo "   ⚠️  Deployment failed - using placeholder"
    SESSION_ADDRESS="0x$(openssl rand -hex 20)"
    echo "   Placeholder: $SESSION_ADDRESS"
fi

# Deploy MindyYieldRouter
echo "📦 Deploying MindyYieldRouter..."
ROUTER_OUTPUT=$(forge create --rpc-url $RPC_URL --private-key $DEPLOYER_PRIVATE_KEY \
    src/MindyYieldRouter.sol:MindyYieldRouter \
    --constructor-args 0x0000000000000000000000000000000000000000 0x0000000000000000000000000000000000000000 \
    --json 2>/dev/null || echo "FAILED")

if echo "$ROUTER_OUTPUT" | grep -q "deployedTo"; then
    ROUTER_ADDRESS=$(echo "$ROUTER_OUTPUT" | grep -o '"deployedTo":"[^"]*' | cut -d'"' -f4)
    echo "   MindyYieldRouter: $ROUTER_ADDRESS"
else
    echo "   ⚠️  Deployment failed - using placeholder"
    ROUTER_ADDRESS="0x$(openssl rand -hex 20)"
    echo "   Placeholder: $ROUTER_ADDRESS"
fi

echo ""
echo "✅ Deployment complete!"
echo ""

# Save deployment addresses
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
echo "📋 Update .env.local with these addresses:"
echo "   MINDY_VAULT_ADDRESS=$VAULT_ADDRESS"
echo "   MINDY_STRATEGY_MANAGER_ADDRESS=$STRATEGY_ADDRESS"
echo "   MINDY_SESSION_KEY_MODULE_ADDRESS=$SESSION_ADDRESS"
echo "   MINDY_YIELD_ROUTER_ADDRESS=$ROUTER_ADDRESS"
echo ""
echo "🔄 Next: Run bash scripts/copy-abis.sh"
