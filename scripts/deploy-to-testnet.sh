#!/bin/bash

# Mindy - Interactive Testnet Deployment Guide
# This script guides you through the deployment process

set -e

echo ""
echo "========================================="
echo "  Mindy - Initia Testnet Deployment"
echo "========================================="
echo ""
echo "This script will help you deploy Mindy contracts to Initia testnet."
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo -e "${YELLOW}Step 1: Check Foundry Installation${NC}"
echo ""

if command -v forge &> /dev/null; then
    echo -e "${GREEN}✓ Foundry is installed${NC}"
    forge --version | head -1
else
    echo -e "${RED}✗ Foundry not found${NC}"
    echo ""
    echo "Please install Foundry first:"
    echo ""
    echo "  curl -L https://foundry.paradigm.xyz | bash"
    echo "  foundryup"
    echo ""
    echo "Then restart your terminal and run this script again."
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 2: Fund Your Account${NC}"
echo ""
echo "Before deploying, you need testnet INIT tokens for gas."
echo ""
echo "1. Get your Ethereum address from your private key"
echo "2. Visit: https://faucet.initia.xyz"
echo "3. Request testnet INIT tokens"
echo ""
echo -n "Press Enter when you have funded your account..."
read

echo ""
echo -e "${YELLOW}Step 3: Set Environment Variables${NC}"
echo ""
echo -n "Enter your private key (0x...): "
read -s PRIVATE_KEY_INPUT
echo ""

if [[ ! $PRIVATE_KEY_INPUT =~ ^0x[a-fA-F0-9]{64}$ ]]; then
    echo -e "${RED}Invalid private key format!${NC}"
    exit 1
fi

export PRIVATE_KEY=$PRIVATE_KEY_INPUT

echo ""
echo -n "Enter underlying token address (or press Enter for zero address): "
read UNDERLYING_TOKEN_INPUT

if [ -z "$UNDERLYING_TOKEN_INPUT" ]; then
    UNDERLYING_TOKEN_INPUT="0x0000000000000000000000000000000000000000"
fi

export UNDERLYING_TOKEN=$UNDERLYING_TOKEN_INPUT

echo ""
echo -e "${YELLOW}Step 4: Deploy Contracts${NC}"
echo ""
echo "Deploying to Initia testnet (initiation-2)..."
echo ""

# Configuration
RPC_URL="https://rpc.testnet.initia.xyz"
CHAIN_ID="initiation-2"
DEPLOYMENTS_FILE="$PROJECT_ROOT/deployments-testnet.json"
CONTRACTS_DIR="$PROJECT_ROOT/contracts"

cd "$CONTRACTS_DIR"

# Compile
echo "🔨 Compiling contracts..."
forge build

echo ""
echo "🚀 Deploying contracts..."
echo ""

# Deploy
DEPLOY_OUTPUT=$(forge script script/Deploy.s.sol:DeployScript \
    --rpc-url $RPC_URL \
    --chain-id $CHAIN_ID \
    --broadcast \
    -vvvv 2>&1)

DEPLOY_STATUS=$?

if [ $DEPLOY_STATUS -ne 0 ]; then
    echo -e "${RED}Deployment failed!${NC}"
    echo ""
    echo "Error:"
    echo "$DEPLOY_OUTPUT" | tail -20
    echo ""
    echo "Troubleshooting:"
    echo "1. Make sure you have INIT tokens: https://faucet.initia.xyz"
    echo "2. Check your private key is correct"
    echo "3. Verify testnet is operational"
    exit 1
fi

# Extract addresses
echo "$DEPLOY_OUTPUT" | grep "deployed:" || true

VAULT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "MindyVault deployed:" | awk '{print $NF}')
STRATEGY_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "MindyStrategyManager deployed:" | awk '{print $NF}')
SESSION_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "MindySessionKeyModule deployed:" | awk '{print $NF}')
ROUTER_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "MindyYieldRouter deployed:" | awk '{print $NF}')

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  ✓ Deployment Successful!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "Contract Addresses:"
echo "  MindyVault:              $VAULT_ADDRESS"
echo "  MindyStrategyManager:    $STRATEGY_ADDRESS"
echo "  MindySessionKeyModule:   $SESSION_ADDRESS"
echo "  MindyYieldRouter:        $ROUTER_ADDRESS"
echo ""

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

echo -e "${GREEN}✓ Deployment info saved to: $DEPLOYMENTS_FILE${NC}"
echo ""
echo "========================================="
echo "  Next Steps:"
echo "========================================="
echo ""
echo "1. Update .env.local with these values:"
echo ""
echo "   NEXT_PUBLIC_RPC_URL=$RPC_URL"
echo "   NEXT_PUBLIC_CHAIN_ID=$CHAIN_ID"
echo "   MINDY_VAULT_ADDRESS=$VAULT_ADDRESS"
echo "   MINDY_STRATEGY_MANAGER_ADDRESS=$STRATEGY_ADDRESS"
echo "   MINDY_SESSION_KEY_MODULE_ADDRESS=$SESSION_ADDRESS"
echo "   MINDY_YIELD_ROUTER_ADDRESS=$ROUTER_ADDRESS"
echo ""
echo "2. Copy ABIs to frontend:"
echo "   bash scripts/copy-abis.sh"
echo ""
echo "3. Commit to git:"
echo "   git add deployments-testnet.json .env.local frontend/abis/"
echo "   git commit -m 'Deploy to Initia testnet'"
echo "   git push"
echo ""
echo "4. Verify contracts on explorer:"
echo "   https://explorer.testnet.initia.xyz"
echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
