# Technical Debt Log

## 📋 Overview
This file tracks technical debt and deferred tasks for the Mindy project.

---

## 🔴 High Priority

### 1. Full Appchain Deployment (20GB Snapshot Download)

**Status:** Deferred  
**Reason:** Current environment cannot accommodate 20GB download  
**Impact:** Using Initia testnet instead of local appchain

#### What needs to be done:
- Download and restore the full Initia blockchain snapshot (~20GB)
- Run local `weave` appchain for full control and testing
- Update contract deployment to use local RPC instead of testnet

#### Prerequisites:
- Sufficient disk space (25GB+ recommended)
- Stable high-bandwidth internet connection
- Docker Desktop running (if using Docker-based deployment)

#### Commands to execute when ready:
```bash
# 1. Install weave CLI (already done)
export PATH=$PATH:/home/nasigoreng/.local/bin

# 2. Initialize weave config
cd /home/nasigoreng/Mindy
weave init

# 3. Follow interactive setup:
#    - Select 'EVM' track
#    - Generate new account for gas station
#    - Fund address via: https://faucet.initia.xyz
#    - Set chain name: 'Mindy'

# 4. Start appchain
bash scripts/deploy-appchain.sh

# 5. Redeploy contracts to local chain
bash scripts/deploy-contracts.sh

# 6. Update .env.local with local RPC:
#    NEXT_PUBLIC_RPC_URL=http://localhost:26657
#    NEXT_PUBLIC_CHAIN_ID=mindy-local
```

#### Files that need updating:
- `.env.local` - Change RPC URL and Chain ID to local values
- `scripts/deploy-contracts.sh` - May need adjustment for local deployment

#### Current workaround:
Using Initia testnet (`https://rpc.testnet.initia.xyz`, chain: `initiation-2`)

---

## 🟡 Medium Priority

### 2. Real Contract Deployment

**Status:** Placeholder addresses in use  
**Reason:** Need funded deployer account

#### What needs to be done:
1. Generate/fund a deployer account with testnet tokens
2. Add private key to `.env.local`:
   ```
   DEPLOYER_PRIVATE_KEY=0x...
   ```
3. Re-run deployment script:
   ```bash
   bash scripts/deploy-contracts.sh
   ```
4. Update contract addresses in `.env.local`

#### Current placeholder addresses:
```
MINDY_VAULT_ADDRESS=0x08f382645c04f880c1e8685fc36c00477261fe81
MINDY_STRATEGY_MANAGER_ADDRESS=0x01d1ec4a39b282342bd368ffcf2aeb4fc45525c0
MINDY_SESSION_KEY_MODULE_ADDRESS=0x3ff20a4f85fa720917e0a27f592df1f00c174cfc
MINDY_YIELD_ROUTER_ADDRESS=0xc728248b646a99768e757f3999d141582550d8ab
```

---

## 🟢 Low Priority

### 3. Contract Linting Issues

**Status:** Minor warnings only  
**Impact:** None - contracts compile successfully

#### Issues to address:
- Mixed case naming conventions (e.g., `targetAPY` → `targetApy`)
- Unwrapped modifier logic for gas optimization
- Import style preferences (named vs plain imports)

These are linting notes, not errors. Can be fixed in future refactoring.

---

## 📝 Environment Setup Notes

### Current Environment:
- Go: 1.22.0
- Foundry: 1.5.1-stable
- Node: v22.22.0
- pnpm: 10.28.1
- weave: v0.3.8 (installed at `~/.local/bin/weave`)

### PATH Configuration:
Added to `~/.bashrc`:
```bash
export PATH=$PATH:/home/nasigoreng/.local/bin
```

---

## 📅 Last Updated
2026-03-26
