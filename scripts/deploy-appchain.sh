#!/bin/bash

# Mindy - Initia Appchain Deployment Script
# Run this in WSL after Docker Desktop is running

set -e

echo "🚀 Mindy - Deploying Initia Appchain..."
echo ""

# Check if weave is installed
if ! command -v weave &> /dev/null; then
    echo "❌ Weave CLI not found. Installing..."
    go install github.com/initia-labs/weave/cmd/weave@latest
    
    # Add to PATH if not already
    export PATH=$PATH:$(go env GOPATH)/bin
    echo 'export PATH=$PATH:$(go env GOPATH)/bin' >> ~/.bashrc
fi

echo "✅ Weave CLI found"
weave --version
echo ""

# Navigate to project directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo "📁 Project root: $PROJECT_ROOT"
echo ""

# Initialize weave config if not exists
if [ ! -d "$PROJECT_ROOT/.weave" ]; then
    echo "🔧 Initializing Weave configuration..."
    weave init
    
    echo ""
    echo "⚙️  Configuration steps:"
    echo "1. Select 'EVM' track when prompted"
    echo "2. Choose 'Generate new account' for gas station"
    echo "3. Fund the address via Initia testnet faucet"
    echo "4. Set chain name: 'Mindy'"
    echo "5. Enable oracle price feeds"
    echo ""
    
    echo "📝 Run: weave init"
    echo "   Follow the interactive setup, then re-run this script"
    exit 0
fi

echo "✅ Weave configuration found"
echo ""

# Start the executor
echo "🔄 Starting Initia executor..."
weave opinit start executor -d

# Start the relayer
echo "🔄 Starting Initia relayer..."
weave relayer start -d

# Wait for services to start
echo "⏳ Waiting for services to initialize..."
sleep 10

# Check status
echo ""
echo "📊 Appchain Status:"
weave status

echo ""
echo "✅ Appchain deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Fund your gas station via: https://faucet.initia.xyz"
echo "2. Deploy contracts with: bash scripts/deploy-contracts.sh"
echo "3. Check chain ID and RPC from weave status output"
echo ""
echo "💡 Save these values for .env.local:"
echo "   NEXT_PUBLIC_RPC_URL=<from weave status>"
echo "   NEXT_PUBLIC_CHAIN_ID=<from weave status>"
