#!/bin/bash

# Mindy - Full Setup Script
# Run this in WSL to set up everything from scratch

set -e

echo "🚀 Mindy - Full Setup Script"
echo "============================"
echo ""

# Check prerequisites
echo "🔍 Checking prerequisites..."
echo ""

# Check Go
if command -v go &> /dev/null; then
    GO_VERSION=$(go version | cut -d' ' -f3)
    echo "✅ Go found: $GO_VERSION"
else
    echo "❌ Go not found"
    echo "   Install with: curl -LO https://go.dev/dl/go1.22.0.linux-amd64.tar.gz"
    echo "   Then: sudo tar -C /usr/local -xzf go1.22.0.linux-amd64.tar.gz"
    exit 1
fi

# Check Foundry
if command -v forge &> /dev/null; then
    FORGE_VERSION=$(forge --version | head -n1)
    echo "✅ Foundry found: $FORGE_VERSION"
else
    echo "❌ Foundry not found"
    echo "   Install with: curl -L https://foundry.paradigm.xyz | bash"
    echo "   Then: foundryup"
    exit 1
fi

# Check Docker
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo "✅ Docker found: $DOCKER_VERSION"
else
    echo "⚠️  Docker not found in WSL (this is OK - Docker Desktop runs on Windows)"
    echo "   Ensure Docker Desktop is running on Windows"
fi

echo ""
echo "✅ All prerequisites met!"
echo ""

# Navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo "📁 Project root: $PROJECT_ROOT"
echo ""

# Install Foundry dependencies
echo "📦 Installing Foundry dependencies..."
cd "$PROJECT_ROOT/contracts"

if [ ! -d "lib/openzeppelin-contracts" ]; then
    echo "   Installing OpenZeppelin Contracts..."
    forge install OpenZeppelin/openzeppelin-contracts --no-commit
else
    echo "   ✅ OpenZeppelin already installed"
fi

if [ ! -d "lib/forge-std" ]; then
    echo "   Installing forge-std..."
    forge install foundry-rs/forge-std --no-commit
else
    echo "   ✅ forge-std already installed"
fi

echo ""
echo "✅ Foundry dependencies installed"
echo ""

# Compile contracts
echo "🔨 Compiling contracts..."
forge build

echo ""
echo "✅ Contracts compiled!"
echo ""

cd "$PROJECT_ROOT"

# Run deployment scripts
echo "🚀 Running deployment scripts..."
echo ""

echo "Step 1: Deploy Appchain"
echo "======================="
bash "$PROJECT_ROOT/scripts/deploy-appchain.sh"

echo ""
echo "Step 2: Deploy Contracts"
echo "========================"
bash "$PROJECT_ROOT/scripts/deploy-contracts.sh"

echo ""
echo "Step 3: Copy ABIs"
echo "================"
bash "$PROJECT_ROOT/scripts/copy-abis.sh"

echo ""
echo "🎉 Full setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.local with your API keys and contract addresses"
echo "2. Run 'pnpm install' in project root"
echo "3. Run 'pnpm dev' to start the frontend"
echo ""
echo "Good luck with the hackathon! 🚀"
