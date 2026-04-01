#!/bin/bash

# Mindy - Initia Testnet Deployment Script
# Deploy to Initia testnet (initiation-2)

set -e

echo "========================================="
echo "  Mindy - Initia Testnet Deployment"
echo "========================================="
echo ""

# Navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CONTRACTS_DIR="$PROJECT_ROOT/contracts"

cd "$CONTRACTS_DIR"

# Configuration
RPC_URL="https://rpc.testnet.initia.xyz"
CHAIN_ID="initiation-2"
DEPLOYMENTS_FILE="$PROJECT_ROOT/deployments-testnet.json"

echo "📡 Network Configuration:"
echo "   RPC URL: $RPC_URL"
echo "   Chain ID: $CHAIN_ID"
echo ""

# Check prerequisites
echo "🔍 Checking prerequisites..."

# Check Foundry
if ! command -v forge &> /dev/null; then
    echo "❌ Foundry not found!"
    echo ""
    echo "   Install Foundry with:"
    echo "   curl -L https://foundry.paradigm.xyz | bash"
    echo "   foundryup"
    echo ""
    exit 1
fi

echo "✅ Foundry: $(forge --version | head -1)"

# Check private key
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ PRIVATE_KEY environment variable not set!"
    echo ""
    echo "   Export your private key:"
    echo "   export PRIVATE_KEY=0x..."
    echo ""
    echo "   Get testnet INIT from: https://faucet.initia.xyz"
    exit 1
fi

# Check UNDERLYING_TOKEN (mock token for testing)
if [ -z "$UNDERLYING_TOKEN" ]; then
    echo "⚠️  UNDERLYING_TOKEN not set, using zero address"
    echo "   You may need to deploy a mock ERC20 token first"
    UNDERLYING_TOKEN="0x0000000000000000000000000000000000000000"
fi

echo ""
echo "🔨 Compiling contracts..."
forge build

echo ""
echo "🚀 Deploying contracts to Initia testnet..."
echo ""

# Deploy using Foundry script
echo "📦 Running deployment script..."
DEPLOY_OUTPUT=$(forge script script/Deploy.s.sol:DeployScript \
    --rpc-url $RPC_URL \
    --chain-id $CHAIN_ID \
    --broadcast \
    -vvvv 2>&1 || echo "DEPLOYMENT_FAILED")

if echo "$DEPLOY_OUTPUT" | grep -q "DEPLOYMENT_FAILED"; then
    echo "❌ Deployment failed!"
    echo ""
    echo "Error output:"
    echo "$DEPLOY_OUTPUT"
    echo ""
    echo "Troubleshooting:"
    echo "1. Make sure you have INIT tokens in your account"
    echo "   Get testnet tokens: https://faucet.initia.xyz"
    echo ""
    echo "2. Check your private key is correct"
    echo ""
    echo "3. Verify Initia testnet is operational"
    echo ""
    exit 1
fi

# Parse deployment output
echo "$DEPLOY_OUTPUT" | grep "MindyVault deployed:" || true
echo "$DEPLOY_OUTPUT" | grep "MindyStrategyManager deployed:" || true
echo "$DEPLOY_OUTPUT" | grep "MindySessionKeyModule deployed:" || true
echo "$DEPLOY_OUTPUT" | grep "MindyYieldRouter deployed:" || true

echo ""
echo "✅ Deployment complete!"
echo ""

# Extract addresses from output
VAULT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "MindyVault deployed:" | awk '{print $NF}')
STRATEGY_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "MindyStrategyManager deployed:" | awk '{print $NF}')
SESSION_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "MindySessionKeyModule deployed:" | awk '{print $NF}')
ROUTER_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "MindyYieldRouter deployed:" | awk '{print $NF}')

# Save deployment info
cat > "$DEPLOYMENTS_FILE" <<EOF
{
  "network": "Initia Testnet",
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
echo "========================================="
echo "  📋 Update .env.local with:"
echo "========================================="
echo ""
echo "NEXT_PUBLIC_RPC_URL=$RPC_URL"
echo "NEXT_PUBLIC_CHAIN_ID=$CHAIN_ID"
echo "MINDY_VAULT_ADDRESS=$VAULT_ADDRESS"
echo "MINDY_STRATEGY_MANAGER_ADDRESS=$STRATEGY_ADDRESS"
echo "MINDY_SESSION_KEY_MODULE_ADDRESS=$SESSION_ADDRESS"
echo "MINDY_YIELD_ROUTER_ADDRESS=$ROUTER_ADDRESS"
echo ""
echo "🔄 Next steps:"
echo "   1. Update .env.local with these addresses"
echo "   2. Run: bash scripts/copy-abis.sh"
echo "   3. Commit and push to GitHub"
echo ""
echo "🎉 Deployment successful!"
