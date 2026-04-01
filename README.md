# Mindy - AI-Powered Cross-Rollup Yield Optimizer

[![Hackathon](https://img.shields.io/badge/Hackathon-INITIATE-blue)](https://dorahacks.io/hackathon/initiate)
[![Initia](https://img.shields.io/badge/Initia-EVM-orange)](https://initia.xyz)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**Mindy** is an AI-powered yield optimizer that automatically scans opportunities across Initia ecosystem rollups, scores them for risk/reward, and auto-rebalances your portfolio using session keys and Interwoven Bridge.

> **Mind your yield, automatically** 🧠

## 🌟 Features

- **AI-Powered Analysis**: Llama 3.1 analyzes yield opportunities on 5 risk dimensions
- **Cross-Rollup Optimization**: Automatically bridge funds to highest-yield pools
- **Session Keys**: Grant once, auto-rebalance without repeated wallet popups
- **Conversational AI**: Chat with Mindy about your portfolio decisions
- **Auto-Compounding**: Continuously optimize and reinvest yields
- **Transparent Reasoning**: AI explains every decision in plain English

## 🏗️ Architecture

```
┌─────────────────┐
│   Next.js App   │
│  + AI Engine    │
└────────┬────────┘
         │
┌────────▼────────┐
│  InterwovenKit  │
└────────┬────────┘
         │
┌────────▼────────┐
│   Mindy Chain   │
│  (EVM Rollup)   │
├─────────────────┤
│ MindyVault      │
│ StrategyManager │
│ SessionKeyModule│
│ YieldRouter     │
└─────────────────┘
```

## 📁 Project Structure

```
Initiate/
├── contracts/              # Solidity contracts (Foundry)
│   ├── src/
│   │   ├── MindyVault.sol
│   │   ├── MindyStrategyManager.sol
│   │   ├── MindySessionKeyModule.sol
│   │   └── MindyYieldRouter.sol
│   ├── script/
│   │   └── Deploy.s.sol
│   └── test/
├── frontend/               # Next.js + TypeScript + TailwindCSS
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/     # Portfolio overview
│   │   │   ├── strategies/    # Yield opportunities
│   │   │   ├── bridge/        # Cross-rollup transfers
│   │   │   ├── settings/      # Session keys & config
│   │   │   └── api/           # AI endpoints
│   │   ├── components/
│   │   │   ├── dashboard/     # Dashboard widgets
│   │   │   ├── strategies/    # Strategy cards
│   │   │   ├── shared/        # Common components
│   │   │   └── ui/            # shadcn/ui components
│   │   ├── hooks/             # React hooks for contracts
│   │   └── lib/               # Utilities, AI client
│   ├── abis/                  # Contract ABIs
│   └── package.json
├── scripts/                # Deployment & setup (WSL)
│   ├── deploy-to-testnet.sh
│   ├── deploy-testnet.sh
│   ├── deploy-local.sh
│   ├── copy-abis.sh
│   └── setup.sh
├── docs/                   # Documentation
│   ├── TESTNET_DEPLOYMENT.md
│   ├── FRONTEND_IMPLEMENTATION.md
│   ├── BUILD_SUMMARY.md
│   └── API_KEYS_SETUP.md
├── deployments-testnet.json # Testnet deployment info
├── DEPLOYMENT_QUICKSTART.md
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **pnpm**
- **Docker Desktop** (running)
- **WSL** with:
  - Go 1.22+
  - Foundry (forge, cast, anvil)
  - Weave CLI (for Initia)

### 1. Clone and Install

```bash
# Frontend dependencies
cd frontend
pnpm install
cd ..
```

### 2. Set Up Environment

Create `.env.local` in project root:

```bash
# AI Provider (Get from https://console.groq.com)
GROQ_API_KEY=gsk_your_key_here

# Contract Addresses (update after deployment)
MINDY_VAULT_ADDRESS=
MINDY_STRATEGY_MANAGER_ADDRESS=
MINDY_SESSION_KEY_MODULE_ADDRESS=
MINDY_YIELD_ROUTER_ADDRESS=
```

### 3. Deploy Contracts

#### Option A: Local Testing (Anvil)

```bash
cd /mnt/d/Projekan/Macam2Hackathon/Initiate
bash scripts/deploy-local.sh
bash scripts/copy-abis.sh
```

#### Option B: Initia Testnet (Recommended for Hackathon)

**Step 1**: Get testnet INIT from https://faucet.initia.xyz

**Step 2**: Run deployment script in WSL:

```bash
cd /mnt/d/Projekan/Macam2Hackathon/Initiate
bash scripts/deploy-to-testnet.sh
```

This interactive script will:
- Check Foundry installation
- Guide you through funding your account
- Deploy all 4 contracts to Initia testnet
- Display addresses to update in `.env.local`

**Step 3**: Update `.env.local` with deployed addresses:

```bash
NEXT_PUBLIC_RPC_URL=https://rpc.testnet.initia.xyz
NEXT_PUBLIC_CHAIN_ID=initiation-2
MINDY_VAULT_ADDRESS=0x...
MINDY_STRATEGY_MANAGER_ADDRESS=0x...
MINDY_SESSION_KEY_MODULE_ADDRESS=0x...
MINDY_YIELD_ROUTER_ADDRESS=0x...
```

**Step 4**: Copy ABIs and commit:

```bash
bash scripts/copy-abis.sh
git add deployments-testnet.json .env.local frontend/abis/
git commit -m "Deploy Mindy to Initia testnet"
git push
```

### 4. Run Frontend

```bash
cd frontend
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### 📱 Frontend Pages

- **Dashboard** (`/dashboard`) - Portfolio overview & AI insights
- **Strategies** (`/strategies`) - Browse & invest in yield opportunities
- **Bridge** (`/bridge`) - Cross-rollup asset transfers
- **Settings** (`/settings`) - Session keys & preferences

## 🎯 Hackathon Demo Flow

1. **Connect Wallet** → See .init username resolve
2. **Deposit INIT** → Mint vault shares
3. **Run AI Analysis** → Watch live risk scoring
4. **Enable Auto-Rebalance** → Grant session key (one popup)
5. **AI Rebalances** → No popup! Funds move automatically
6. **Bridge Transfer** → Cross-rollup optimization
7. **Chat with AI** → "Why did you pick Pool B?"

## 🧠 AI Engine

Mindy uses **Groq's free tier** (Llama 3.1 70B) for:

- **Yield Analysis**: Scores opportunities on risk/reward
- **Portfolio Optimization**: Mean-variance allocation
- **Conversational Interface**: Explain decisions in chat

### API Endpoints

- `POST /api/ai/analyze` - Analyze yields
- `POST /api/ai/rebalance` - Generate rebalance
- `POST /api/ai/chat` - Chat with Mindy
- `GET /api/yields` - Fetch opportunities

## 📜 Smart Contracts

### MindyVault (ERC4626)
- Tokenized vault for user deposits
- 2% performance fee
- Emergency withdrawal

### MindyStrategyManager
- Registry of yield strategies
- AI-controlled rebalancing
- Risk score tracking

### MindySessionKeyModule
- Scoped session authorization
- Time-limited permissions
- Function-level access control

### MindyYieldRouter
- Cross-rollup bridge orchestration
- Transfer tracking
- Fee management

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, TypeScript, TailwindCSS |
| **UI** | shadcn/ui, Radix UI |
| **Wallet** | InterwovenKit (@initia) |
| **AI** | Groq SDK (Llama 3.1) |
| **Contracts** | Solidity 0.8, Foundry |
| **Appchain** | Initia EVM Rollup |

## 📊 Scoring Criteria Alignment

| Criteria | Weight | Implementation |
|---|---|---|
| **Technical Execution** | 30% | All 3 Initia-native features deeply integrated |
| **Originality** | 20% | AI yield analysis with transparent reasoning |
| **Product Value** | 20% | Solves real DeFi pain point |
| **Working Demo** | 20% | End-to-end flow with visible AI |
| **Market Understanding** | 10% | Clear revenue model, target users |

## 🎥 Demo Video

[Link to demo video]

## 📝 Submission

- **Hackathon**: INITIATE: The Initia Hackathon (Season 1)
- **Track**: DeFi + AI (Cross-track)
- **Deadline**: April 15, 2026
- **Submission File**: `.initia/submission.json`

## 🤝 Team

Built by [Your Name] with AI assistance from Qoder + Claude Code

## 📚 Documentation

- **[TESTNET_DEPLOYMENT.md](docs/TESTNET_DEPLOYMENT.md)** - Complete guide to deploying on Initia testnet
- **[FRONTEND_IMPLEMENTATION.md](docs/FRONTEND_IMPLEMENTATION.md)** - Detailed frontend architecture and components
- **[DEPLOYMENT_QUICKSTART.md](DEPLOYMENT_QUICKSTART.md)** - Quick reference for deployment
- **[API_KEYS_SETUP.md](docs/API_KEYS_SETUP.md)** - Setting up Groq and AI providers
- **[BUILD_SUMMARY.md](docs/BUILD_SUMMARY.md)** - Overall project build summary

## 📄 License

MIT License - see [LICENSE](LICENSE)

## 🙏 Acknowledgments

- **Initia Labs** - For building the Interwoven Stack
- **DoraHacks** - For hosting the hackathon
- **Groq** - For free-tier AI inference

---

**Mindy** - Mind your yield, automatically 🧠✨
