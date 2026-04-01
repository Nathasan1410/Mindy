# Quick Start: Deploy to Initia Testnet

## One-Line Deployment

If you have Foundry installed and a funded account:

```bash
export PRIVATE_KEY=0x... && export UNDERLYING_TOKEN=0x... && bash scripts/deploy-testnet.sh
```

## Step-by-Step (First Time)

### 1. Install Foundry (WSL)

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 2. Get Testnet INIT

Visit: https://faucet.initia.xyz

### 3. Deploy

```bash
cd /mnt/d/Projekan/Macam2Hackathon/Initiate
bash scripts/deploy-to-testnet.sh
```

This interactive script will:
- Check if Foundry is installed
- Guide you through funding your account
- Ask for your private key securely
- Deploy all contracts
- Show you the addresses to update

### 4. Update .env.local

Copy the addresses from the deployment output to `.env.local`:

```env
NEXT_PUBLIC_RPC_URL=https://rpc.testnet.initia.xyz
NEXT_PUBLIC_CHAIN_ID=initiation-2
MINDY_VAULT_ADDRESS=0x...
MINDY_STRATEGY_MANAGER_ADDRESS=0x...
MINDY_SESSION_KEY_MODULE_ADDRESS=0x...
MINDY_YIELD_ROUTER_ADDRESS=0x...
```

### 5. Copy ABIs

```bash
bash scripts/copy-abis.sh
```

### 6. Commit

```bash
git add deployments-testnet.json .env.local frontend/abis/
git commit -m "Deploy Mindy to Initia testnet"
git push
```

## Done! 🎉

Your contracts are now deployed to Initia testnet.

Verify at: https://explorer.testnet.initia.xyz

---

**Need help?** See [docs/TESTNET_DEPLOYMENT.md](docs/TESTNET_DEPLOYMENT.md) for detailed instructions.
