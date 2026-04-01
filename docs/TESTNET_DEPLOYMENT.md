# Initia Testnet Deployment Guide

This guide walks you through deploying Mindy contracts to Initia testnet.

## Prerequisites

### 1. Install Foundry (if not already installed)

In your WSL terminal:

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Verify installation:
```bash
forge --version
```

### 2. Get Testnet INIT Tokens

Visit the Initia faucet to get testnet tokens:
- **Faucet**: https://faucet.initia.xyz
- **Explorer**: https://explorer.testnet.initia.xyz

## Deployment Steps

### Step 1: Export Private Key

Export the private key of your funded testnet account:

```bash
export PRIVATE_KEY=0x...your_private_key_here
```

**Important**: This account needs INIT tokens for gas. Get them from the faucet.

### Step 2: Deploy Contracts

Navigate to the project root and run the deployment script:

```bash
cd /mnt/d/Projekan/Macam2Hackathon/Initiate
bash scripts/deploy-testnet.sh
```

The script will:
1. Compile all contracts
2. Deploy MindyVault, MindyStrategyManager, MindySessionKeyModule, and MindyYieldRouter
3. Configure vault-strategy relationships
4. Save deployment addresses to `deployments-testnet.json`
5. Display the addresses you need to add to `.env.local`

### Step 3: Update .env.local

After successful deployment, update your `.env.local` file with the testnet addresses:

```env
# Initia Testnet Configuration
NEXT_PUBLIC_RPC_URL=https://rpc.testnet.initia.xyz
NEXT_PUBLIC_CHAIN_ID=initiation-2
NEXT_PUBLIC_CHAIN_NAME=Initia Testnet

# Contract Addresses (replace with your deployed addresses)
MINDY_VAULT_ADDRESS=0x...
MINDY_STRATEGY_MANAGER_ADDRESS=0x...
MINDY_SESSION_KEY_MODULE_ADDRESS=0x...
MINDY_YIELD_ROUTER_ADDRESS=0x...
```

### Step 4: Copy ABIs to Frontend

Run the ABI copy script:

```bash
bash scripts/copy-abis.sh
```

This copies the contract ABIs to `frontend/abis/` for the frontend to use.

### Step 5: Commit and Push

Commit your deployment:

```bash
git add deployments-testnet.json .env.local frontend/abis/
git commit -m "Deploy Mindy contracts to Initia testnet"
git push
```

## Verification

### Check Contract on Explorer

Visit the Initia testnet explorer and search for your contract addresses:
- https://explorer.testnet.initia.xyz

### Verify Contracts (Optional)

To verify contracts on the explorer, you may need to:

```bash
cd contracts
forge verify-contract \
  --chain-id 31337 \
  --compiler-version v0.8.24 \
  src/MindyVault.sol:MindyVault \
  YOUR_CONTRACT_ADDRESS
```

## Troubleshooting

### "insufficient funds" Error

**Problem**: Your account doesn't have enough INIT for gas.

**Solution**: Visit https://faucet.initia.xyz and request more testnet tokens.

### "nonce too low" Error

**Problem**: Multiple transactions sent too quickly.

**Solution**: Wait a few seconds between deployments or manually set nonce:
```bash
forge script script/Deploy.s.sol:DeployScript --rpc-url $RPC_URL --broadcast --nonce 5
```

### "connection refused" Error

**Problem**: Initia testnet RPC is unavailable.

**Solution**: 
1. Check testnet status: https://status.initia.xyz
2. Try alternative RPC endpoints if available
3. Wait and retry later

### Contract Verification Failed

**Problem**: Constructor arguments don't match.

**Solution**: Make sure you're using the correct compiler version and constructor arguments when verifying.

## Manual Deployment (Alternative)

If the automated script fails, you can deploy manually:

```bash
cd contracts

# Deploy MindyVault
forge create --rpc-url https://rpc.testnet.initia.xyz \
  --private-key $PRIVATE_KEY \
  src/MindyVault.sol:MindyVault \
  --constructor-args $UNDERLYING_TOKEN $DEPLOYER_ADDRESS

# Deploy MindyStrategyManager
forge create --rpc-url https://rpc.testnet.initia.xyz \
  --private-key $PRIVATE_KEY \
  src/MindyStrategyManager.sol:MindyStrategyManager \
  --constructor-args $DEPLOYER_ADDRESS

# Deploy MindySessionKeyModule
forge create --rpc-url https://rpc.testnet.initia.xyz \
  --private-key $PRIVATE_KEY \
  src/MindySessionKeyModule.sol:MindySessionKeyModule

# Deploy MindyYieldRouter
forge create --rpc-url https://rpc.testnet.initia.xyz \
  --private-key $PRIVATE_KEY \
  src/MindyYieldRouter.sol:MindyYieldRouter \
  --constructor-args $DEPLOYER_ADDRESS $VAULT_ADDRESS
```

## Post-Deployment Checklist

- [ ] Contracts deployed successfully
- [ ] Addresses saved to `deployments-testnet.json`
- [ ] `.env.local` updated with testnet addresses
- [ ] ABIs copied to `frontend/abis/`
- [ ] Changes committed to git
- [ ] Contracts verified on explorer (optional)
- [ ] Frontend updated to use testnet configuration
- [ ] Test wallet connection
- [ ] Test basic contract interactions

## Next Steps

After deployment:

1. **Build Frontend Pages**: Complete the remaining UI components
2. **Test Integration**: Verify wallet connection and contract interactions
3. **Record Demo**: Create a demo video for the hackathon
4. **Submit to Hackathon**: Submit your project on DoraHacks

## Resources

- **Initia Documentation**: https://docs.initia.xyz
- **Initia Discord**: https://discord.gg/initia
- **DoraHacks Submission**: https://dorahacks.io/hackathon/initiate
- **Initia Faucet**: https://faucet.initia.xyz
- **Testnet Explorer**: https://explorer.testnet.initia.xyz
