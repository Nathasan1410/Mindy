# Mindy Frontend Implementation

## Overview

This document summarizes the complete frontend implementation for Mindy - AI-powered yield optimizer on Initia.

## Pages Created

### 1. Dashboard (`/dashboard`)
**File**: `frontend/src/app/dashboard/page.tsx`

**Features**:
- Portfolio overview with total value, deposited amount, pending rewards, and total earned
- Interactive allocation chart showing distribution across strategies
- AI Insights card with real-time yield analysis
- Quick stats panel showing active strategies, best APY, and average APY
- Responsive navigation with active state indicators

**Components Used**:
- `PortfolioOverview` - Displays key portfolio metrics
- `AllocationChart` - Pie chart visualization using Recharts
- `AIInsightsCard` - AI-powered yield analysis interface

### 2. Strategies (`/strategies`)
**File**: `frontend/src/app/strategies/page.tsx`

**Features**:
- Dual-tab interface: Opportunities vs My Strategies
- Search functionality by name or protocol
- Risk level filtering (Low/Medium/High)
- AI analysis button to get Groq-powered insights
- Grid layout displaying yield opportunities
- Strategy cards with APY, TVL, risk factors, and AI scores

**Components Used**:
- `YieldCard` - Individual yield opportunity display
- `StrategyCard` - Strategy allocation display with risk visualization

### 3. Bridge (`/bridge`)
**File**: `frontend/src/app/bridge/page.tsx`

**Features**:
- Cross-rollup asset transfer interface
- From/To rollup selection dropdowns
- Amount input with fee calculation
- Real-time bridge info (estimated time, fees, receive amount)
- Pending transfers tracking
- Supported rollups list with visual indicators

**Components**:
- Built-in transfer status display
- Mock pending transfers (updates after contract deployment)

### 4. Settings (`/settings`)
**File**: `frontend/src/app/settings/page.tsx`

**Features**:
- **Session Keys Tab**:
  - Grant new session keys with configurable duration
  - Permission selection (deposit, withdraw, rebalance, bridge)
  - Active session management with revoke capability
  - Security notices and warnings

- **Preferences Tab**:
  - Network configuration (Local/Testnet/Mainnet)
  - RPC URL and Chain ID display
  - AI provider selection (Groq/Qwen)
  - Risk tolerance settings
  - Auto-rebalance toggle

- **Notification Settings**:
  - Transaction alerts
  - Yield update notifications
  - AI insights notifications

- **About Section**:
  - Version info
  - Hackathon details
  - Links to GitHub, Initia Docs, DoraHacks

## Custom Hooks

All hooks are exported from `frontend/src/hooks/index.ts`

### useMindyVault
**File**: `hooks/useMindyVault.ts`

**Functions**:
- `totalAssets` - Read total assets in vault
- `totalSupply` - Read total supply of vault shares
- `asset` - Get underlying token address
- `deposit` - Deposit tokens to vault
- `withdraw` - Withdraw tokens from vault

**Utilities**:
- `formatVaultShares()` - Format share amounts
- `formatVaultAssets()` - Format asset amounts

### useStrategyManager
**File**: `hooks/useStrategyManager.ts`

**Functions**:
- `strategyCount` - Get total number of strategies
- `getStrategy(id)` - Get individual strategy details
- `getAllStrategies()` - Get all strategies
- `rebalance()` - Execute AI-powered rebalance
- `updateRiskScore()` - Update strategy risk score

**Utilities**:
- `parseStrategy()` - Parse contract data to Strategy type

### useSessionKey
**File**: `hooks/useSessionKey.ts`

**Functions**:
- `isSessionActive()` - Check if session is active
- `getSessionInfo()` - Get session details
- `grantSession()` - Grant new session key
- `revokeSession()` - Revoke existing session

### useBridge
**File**: `hooks/useBridge.ts`

**Functions**:
- `getTransfer(id)` - Get transfer details
- `getPendingTransfersCount()` - Get pending transfers
- `bridgeToRollup()` - Initiate cross-rollup transfer
- `confirmTransfer()` - Confirm transfer (relayer)

**Utilities**:
- `formatTransferStatus()` - Format status enum to string

### useAIInsights
**File**: `hooks/useAIInsights.ts`

**Functions**:
- `analyzeYields()` - Analyze yield opportunities with AI
- `getRebalanceRecommendation()` - Get AI rebalance suggestion
- `chatWithAI()` - Chat with AI assistant

**Features**:
- Automatic fallback to heuristic scoring when AI unavailable
- Loading states and error handling
- Mock data integration for development

### usePortfolio
**File**: `hooks/usePortfolio.ts`

**Functions**:
- Auto-loads portfolio on wallet connect
- Tracks total value, allocations, rewards
- Refresh capability
- Loading and error states

## UI Components

### Shared Components

#### StrategyCard
**File**: `components/strategies/StrategyCard.tsx`

**Props**:
- `strategy` - Strategy data object
- `onAllocate` - Allocate callback
- `onRebalance` - Rebalance callback

**Features**:
- Risk score visualization with color coding
- APY display
- Current allocation tracking
- AI reasoning display
- Active/inactive status

#### YieldCard
**File**: `components/strategies/YieldCard.tsx`

**Props**:
- `opportunity` - Yield opportunity with AI scores
- `onInvest` - Invest callback

**Features**:
- APY and TVL display
- Risk factors as tags
- AI score visualization (0-100)
- Chain badge
- Invest button

### Dashboard Components

#### PortfolioOverview
**File**: `components/dashboard/PortfolioOverview.tsx`

**Displays**:
- Total Value
- Deposited Amount
- Pending Rewards
- Total Earned

#### AllocationChart
**File**: `components/dashboard/AllocationChart.tsx`

**Features**:
- Interactive pie chart using Recharts
- Percentage and amount tooltips
- Color-coded strategies
- Legend with APY info

#### AIInsightsCard
**File**: `components/dashboard/AIInsightsCard.tsx`

**Features**:
- Analyze button with loading state
- Top 3 yield insights display
- AI scores and reasoning
- Error handling with fallback

### Base UI Components

#### Button
**File**: `components/ui/button.tsx`

**Variants**:
- default, destructive, outline, secondary, ghost, link

**Sizes**:
- default, sm, lg, icon

#### Card
**File**: `components/ui/card.tsx`

**Components**:
- Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter

#### Input
**File**: `components/ui/input.tsx`

Standard text input with Tailwind styling

## ABIs

Placeholder ABI files created in `frontend/abis/`:
- MindyVault.json
- MindyStrategyManager.json
- MindySessionKeyModule.json
- MindyYieldRouter.json

**Note**: These will be populated after running `bash scripts/copy-abis.sh` post-deployment.

## Network Configuration

### Local Development
```env
NEXT_PUBLIC_RPC_URL=http://localhost:26657
NEXT_PUBLIC_CHAIN_ID=mindy-local
```

### Initia Testnet
```env
NEXT_PUBLIC_RPC_URL=https://rpc.testnet.initia.xyz
NEXT_PUBLIC_CHAIN_ID=initiation-2
```

## Dependencies

### Core
- next: 14.1.0
- react: ^18.2.0
- react-dom: ^18.2.0
- typescript: ^5.3.3

### Blockchain
- @initia/interwovenkit-react: latest
- wagmi: (via InterwovenKit)
- viem: (via wagmi)

### UI
- @radix-ui/react-*: Various components
- class-variance-authority: ^0.7.0
- tailwind-merge: ^2.2.0
- tailwindcss-animate: ^1.0.7
- lucide-react: ^0.312.0

### Charts
- recharts: ^2.10.4

### AI
- groq-sdk: ^0.3.2

### State Management
- @tanstack/react-query: ^5.17.9

## Styling

### Tailwind Configuration
**File**: `tailwind.config.ts`

- Custom color scheme with CSS variables
- shadcn/ui compatible
- Dark mode support
- Custom animations (accordion, fade-in)

### Global CSS
**File**: `globals.css`

- CSS variables for theming
- Light and dark mode definitions
- Custom animations
- Base component styles

## Utility Functions

**File**: `lib/utils.ts`

- `cn()` - Class name merger
- `formatAddress()` - Shorten addresses (0x1234...5678)
- `formatNumber()` - Number formatting
- `formatAPY()` - APY percentage formatting
- `formatCurrency()` - USD currency formatting
- `shortenString()` - String truncation

## AI Integration

### Groq Client
**File**: `lib/ai/groq-client.ts`

**Functions**:
- `analyzeYields()` - Analyze yield opportunities
- `generateRebalanceRecommendation()` - Get rebalance suggestions
- `chatWithAI()` - General AI chat

### API Routes
**File**: `app/api/ai/analyze/route.ts`

POST endpoint for AI analysis requests

### Mock Data
**File**: `lib/yields/mock-data.ts`

- 5 mock yield opportunities
- 5 mock strategies
- Used for development and fallback

## Getting Started

### 1. Install Dependencies

```bash
cd frontend
pnpm install
```

### 2. Configure Environment

Copy `.env.local.example` to `.env.local` and update:

```env
# Contract addresses (update after deployment)
MINDY_VAULT_ADDRESS=0x...
MINDY_STRATEGY_MANAGER_ADDRESS=0x...
MINDY_SESSION_KEY_MODULE_ADDRESS=0x...
MINDY_YIELD_ROUTER_ADDRESS=0x...

# Network
NEXT_PUBLIC_RPC_URL=https://rpc.testnet.initia.xyz
NEXT_PUBLIC_CHAIN_ID=initiation-2

# AI
GROQ_API_KEY=your_groq_api_key
```

### 3. Copy ABIs

After contract deployment:

```bash
bash scripts/copy-abis.sh
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build

```bash
pnpm build
pnpm start
```

## Lint

```bash
pnpm lint
pnpm lint:fix
```

## File Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── ai/
│   │   │       └── analyze/
│   │   │           └── route.ts
│   │   ├── bridge/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   ├── strategies/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── providers.tsx
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── AIInsightsCard.tsx
│   │   │   ├── AllocationChart.tsx
│   │   │   └── PortfolioOverview.tsx
│   │   ├── strategies/
│   │   │   ├── StrategyCard.tsx
│   │   │   └── YieldCard.tsx
│   │   ├── shared/
│   │   │   └── WalletButton.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── input.tsx
│   ├── hooks/
│   │   ├── index.ts
│   │   ├── useAIInsights.ts
│   │   ├── useBridge.ts
│   │   ├── useMindyVault.ts
│   │   ├── usePortfolio.ts
│   │   ├── useSessionKey.ts
│   │   └── useStrategyManager.ts
│   └── lib/
│       ├── ai/
│       │   └── groq-client.ts
│       ├── contracts.ts
│       ├── initia.ts
│       ├── utils.ts
│       └── yields/
│           └── mock-data.ts
├── abis/
│   ├── MindyVault.json
│   ├── MindyStrategyManager.json
│   ├── MindySessionKeyModule.json
│   └── MindyYieldRouter.json
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Next Steps

1. **Deploy Contracts**: Run deployment to Initia testnet
2. **Update ABIs**: Copy generated ABIs to frontend/abis/
3. **Update Addresses**: Update contract addresses in .env.local
4. **Test Integration**: Verify wallet connection and contract interactions
5. **Add Real Data**: Replace mock data with actual contract reads
6. **Enhance UI**: Add animations, transitions, and polish
7. **Testing**: Add unit and integration tests

## Known Limitations

- Currently uses mock data for yield opportunities
- Contract interactions will work after deployment
- Some features (auto-rebalance, notifications) need backend implementation
- Bridge transfers need relayer infrastructure

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT - Built for INITIATE Hackathon
