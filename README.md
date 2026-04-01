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
│   └── test/
├── frontend/               # Next.js + TypeScript
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   └── abis/
├── scripts/                # Deployment scripts (WSL)
├── .initia/
│   └── submission.json     # Hackathon submission
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
# Install dependencies
pnpm install
```

### 2. Set Up Environment

Create `.env.local` in project root:

```bash
# AI Provider
GROQ_API_KEY=gsk_your_key_here

# Contract Addresses (auto-filled after deployment)
MINDY_VAULT_ADDRESS=
MINDY_STRATEGY_MANAGER_ADDRESS=
MINDY_SESSION_KEY_MODULE_ADDRESS=
MINDY_YIELD_ROUTER_ADDRESS=
```

### 3. Deploy to Initia (WSL)

```bash
# Full setup (recommended for first time)
cd /mnt/d/Projekan/Macam2Hackathon/Initiate
bash scripts/setup.sh

# Or step-by-step:
bash scripts/deploy-appchain.sh
bash scripts/deploy-contracts.sh
bash scripts/copy-abis.sh
```

### 4. Run Frontend

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

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

## 📄 License

MIT License - see [LICENSE](LICENSE)

## 🙏 Acknowledgments

- **Initia Labs** - For building the Interwoven Stack
- **DoraHacks** - For hosting the hackathon
- **Groq** - For free-tier AI inference

---

**Mindy** - Mind your yield, automatically 🧠✨
