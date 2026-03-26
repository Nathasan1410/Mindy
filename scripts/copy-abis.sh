#!/bin/bash

# Mindy - Copy ABIs to Frontend Script
# Run this in WSL after contracts are compiled

set -e

echo "📋 Mindy - Copying ABIs to Frontend..."
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CONTRACTS_DIR="$PROJECT_ROOT/contracts"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
ABIS_DIR="$FRONTEND_DIR/abis"

echo "📁 Project root: $PROJECT_ROOT"
echo ""

# Create ABIs directory
mkdir -p "$ABIS_DIR"

# Check if contracts are compiled
if [ ! -d "$CONTRACTS_DIR/out" ]; then
    echo "❌ Contracts not compiled. Run forge build first"
    exit 1
fi

echo "✅ Found compiled contracts"
echo ""

# Copy ABI files
echo "📦 Copying ABIs..."

CONTRACTS=("MindyVault" "MindyStrategyManager" "MindySessionKeyModule" "MindyYieldRouter")

for contract in "${CONTRACTS[@]}"; do
    if [ -f "$CONTRACTS_DIR/out/${contract}.sol/${contract}.json" ]; then
        cp "$CONTRACTS_DIR/out/${contract}.sol/${contract}.json" "$ABIS_DIR/${contract}.json"
        echo "   ✅ ${contract}.json"
    else
        echo "   ⚠️  ${contract}.json not found"
    fi
done

echo ""
echo "✅ ABIs copied to: $ABIS_DIR"
echo ""
echo "📁 Files in ABIs directory:"
ls -la "$ABIS_DIR"
echo ""
echo "🎉 Ready to build frontend!"
