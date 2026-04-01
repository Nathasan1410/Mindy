#!/bin/bash

# Mindy - Initia Testnet Deployment Script
# Deploy to Initia testnet (initiation-2)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CONTRACTS_DIR="$PROJECT_ROOT/contracts"

cd "$CONTRACTS_DIR"

echo "🚀 Mindy - Initia Testnet Deployment"
echo "====================================="
echo ""

# Initia Testnet Configuration
RPC_URL="https://rpc.testnet.initia.xyz"
CHAIN_ID="initiation-2"
EXPLORER_URL="https://scan.testnet.initia.xyz"

echo "📡 Network: Initia Testnet"
echo "🔗 Chain ID: $CHAIN_ID"
echo "🌐 RPC URL: $RPC_URL"
echo "🔍 Explorer: $EXPLORER_URL"
echo ""

# Check for private key
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ PRIVATE_KEY not set!"
    echo ""
    echo "Export your private key:"
    echo "   export PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE"
    echo ""
    echo "⚠️  NEVER commit your private key to git!"
    exit 1
fi

# Check for underlying token (or use a testnet token)
if [ -z "$UNDERLYING_TOKEN" ]; then
    echo "⚠️  UNDERLYING_TOKEN not set"
    echo ""
    echo "You can use a testnet token or deploy a mock:"
    echo "Option 1: Use existing testnet USDC (if available)"
    echo "Option 2: Deploy mock token first"
    echo ""
    read -p "Deploy mock token? (y/n): " deploy_mock
    if [ "$deploy_mock" = "y" ]; then
        echo ""
        echo "📦 Deploying Mock USDC..."
        PRIVATE_KEY=$PRIVATE_KEY forge script script/DeployMockToken.s.sol:DeployMockToken \
            --rpc-url "$RPC_URL" \
            --broadcast \
            --slow \
            -vv
            
        # Extract mock token address from broadcast
        MOCK_TOKEN=$(cat broadcast/DeployMockToken.s.sol/$CHAIN_ID/run-latest.json | grep -o '"contractAddress":"[^"]*' | cut -d'"' -f4 | head -1)
        UNDERLYING_TOKEN=$MOCK_TOKEN
        echo "✅ Mock USDC deployed at: $UNDERLYING_TOKEN"
    else
        read -p "Enter underlying token address: " UNDERLYING_TOKEN
    fi
fi

echo ""
echo "📋 Deployment Configuration:"
echo "   Underlying Token: $UNDERLYING_TOKEN"
echo ""

# Compile contracts
echo "🔨 Compiling contracts..."
forge build
echo "✅ Contracts compiled"
echo ""

# Deploy
echo "📦 Deploying Mindy contracts to Initia Testnet..."
echo ""

export UNDERLYING_TOKEN

forge script script/Deploy.s.sol:DeployScript \
    --rpc-url "$RPC_URL" \
    --broadcast \
    --slow \
    -vvvv

echo ""
echo "✅ Deployment complete!"
echo ""

# Extract deployed addresses
DEPLOYMENT_FILE="broadcast/Deploy.s.sol/$CHAIN_ID/run-latest.json"
if [ -f "$DEPLOYMENT_FILE" ]; then
    echo "📄 Extracting deployment addresses..."
    
    VAULT_ADDRESS=$(cat $DEPLOYMENT_FILE | grep -o '"contractName":"MindyVault"[^}]*"contractAddress":"[^"]*' | grep -o '0x[0-9a-fA-F]\{40\}')
    STRATEGY_ADDRESS=$(cat $DEPLOYMENT_FILE | grep -o '"contractName":"MindyStrategyManager"[^}]*"contractAddress":"[^"]*' | grep -o '0x[0-9a-fA-F]\{40\}')
    SESSION_ADDRESS=$(cat $DEPLOYMENT_FILE | grep -o '"contractName":"MindySessionKeyModule"[^}]*"contractAddress":"[^"]*' | grep -o '0x[0-9a-fA-F]\{40\}')
    ROUTER_ADDRESS=$(cat $DEPLOYMENT_FILE | grep -o '"contractName":"MindyYieldRouter"[^}]*"contractAddress":"[^"]*' | grep -o '0x[0-9a-fA-F]\{40\}')
    
    echo ""
    echo "🎉 Deployed Contracts:"
    echo "   MindyVault:              $VAULT_ADDRESS"
    echo "   MindyStrategyManager:    $STRATEGY_ADDRESS"
    echo "   MindySessionKeyModule:   $SESSION_ADDRESS"
    echo "   MindyYieldRouter:        $ROUTER_ADDRESS"
    echo ""
    echo "🔍 View on explorer: $EXPLORER_URL"
    echo ""
    
    # Save to deployments file
    cat > "$PROJECT_ROOT/deployments-testnet.json" <<EOF
{
  "chainId": "$CHAIN_ID",
  "chainName": "Initia Testnet",
  "rpcUrl": "$RPC_URL",
  "explorerUrl": "$EXPLORER_URL",
  "deployedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "contracts": {
    "MockUSDC": "$UNDERLYING_TOKEN",
    "MindyVault": "$VAULT_ADDRESS",
    "MindyStrategyManager": "$STRATEGY_ADDRESS",
    "MindySessionKeyModule": "$SESSION_ADDRESS",
    "MindyYieldRouter": "$ROUTER_ADDRESS"
  }
}
EOF
    
    echo "💾 Saved to: $PROJECT_ROOT/deployments-testnet.json"
    echo ""
    
    # Update .env.local
    echo "📝 To update .env.local, add these lines:"
    echo ""
    echo "   NEXT_PUBLIC_RPC_URL=$RPC_URL"
    echo "   NEXT_PUBLIC_CHAIN_ID=$CHAIN_ID"
    echo "   NEXT_PUBLIC_EXPLORER_URL=$EXPLORER_URL"
    echo "   MINDY_VAULT_ADDRESS=$VAULT_ADDRESS"
    echo "   MINDY_STRATEGY_MANAGER_ADDRESS=$STRATEGY_ADDRESS"
    echo "   MINDY_SESSION_KEY_MODULE_ADDRESS=$SESSION_ADDRESS"
    echo "   MINDY_YIELD_ROUTER_ADDRESS=$ROUTER_ADDRESS"
    echo "   MOCK_USDC_ADDRESS=$UNDERLYING_TOKEN"
    echo ""
else
    echo "❌ Deployment file not found!"
    exit 1
fi

echo "✅ Testnet deployment complete!"
