# Mindy - Technical Debt & TODO List

**Last Updated**: 2026-04-06  
**Status**: Deployed to AWS EC2 (mindy-1 rollup)

---

## 🚨 Critical (Must Fix Before Demo)

### 1. Bridge Router - Stub Implementation
**File**: `contracts/src/MindyYieldRouter.sol:133-140`

**Problem**: Bridge function doesn't actually bridge - just emits events

```solidity
// In production: Call Initia Interwoven Bridge here
// Example:
// IInterwovenBridge(bridgeContract).bridge{value: amount}(
//     destChainId,
//     destStrategy,
//     amount,
//     transferId
// );

// For hackathon demo: emit event
emit BridgeTransferInitiated(...)
```

**Impact**: ❌ Cross-rollup feature doesn't work
**Fix**: Integrate real Interwoven Bridge contract
**Priority**: HIGH (core feature claim)

---

### 2. AI Not Connected to Real Contract Data
**Files**: 
- `frontend/src/hooks/useAIInsights.ts`
- `frontend/src/lib/yields/mock-data.ts`

**Problem**: AI analysis uses mock data, not real vault/strategy data

```typescript
// Currently uses mock data
const result = await analyzeYields(mockYieldOpportunities)

// Should use real data from contracts
const realStrategies = await strategyManager.getAllStrategies()
const realVaultData = await vault.totalAssets()
```

**Impact**: ⚠️ AI insights not based on actual portfolio
**Fix**: Connect hooks to real contract reads
**Priority**: HIGH (AI is main differentiator)

---

### 3. No Real Transactions in Frontend
**Files**: All frontend pages

**Problem**: UI buttons don't execute real transactions

Examples:
- `Dashboard.tsx` - "Analyze" button just shows mock insights
- `Strategies.tsx` - "Invest" button logs to console
- `Bridge.tsx` - "Bridge" button doesn't call contract

```typescript
// Example from bridge/page.tsx
const handleBridge = async () => {
  // In production, this would call the actual contract
  await bridgeToRollup?.()
  console.log("Bridge initiated") // <-- Just logging!
}
```

**Impact**: ❌ Demo is UI-only, no real interactions
**Fix**: Connect all buttons to contract write functions
**Priority**: CRITICAL (can't demo without this)

---

## ⚠️ High Priority (Should Fix)

### 4. Chat UI Not Implemented
**Files**: Missing `components/chat/ChatInterface.tsx`

**Problem**: AI chat API exists (`/api/ai/chat`) but no UI component

**Impact**: ⚠️ Can't demonstrate conversational AI feature
**Fix**: Build chat interface component
**Time Estimate**: 2-3 hours
**Priority**: HIGH (differentiator vs competitors)

---

### 5. Session Key UI Not Connected
**Files**: `app/settings/page.tsx`, `hooks/useSessionKey.ts`

**Problem**: Session key management UI exists but doesn't call real contracts

**Current flow**:
```typescript
const handleGrantSession = async () => {
  await grantSession?.() // <-- Mock function
  console.log("Session granted")
}
```

**Should be**:
```typescript
const handleGrantSession = async () => {
  await writeContract({
    address: sessionKeyModuleAddress,
    functionName: 'grantSession',
    args: [delegate, permissions, expiresAt]
  })
}
```

**Impact**: ⚠️ Can't demo granular session keys (key differentiator)
**Fix**: Connect to wagmi/viem write functions
**Priority**: HIGH

---

### 6. Contract Addresses Point to AWS, But ABIs May Be Outdated
**Files**: `.env.local`, `frontend/abis/*.json`

**Problem**: 
- ✅ Contracts deployed to AWS (mindy-1 rollup)
- ✅ Addresses in `.env.local`
- ⚠️ ABIs may not match latest deployment

**Impact**: ⚠️ Frontend may fail to interact with contracts
**Fix**: Run `bash scripts/copy-abis.sh` again after latest deployment
**Priority**: MEDIUM

---

## 📝 Medium Priority (Nice to Have)

### 7. No Error Handling in UI
**Files**: All pages

**Problem**: No user-friendly error messages for:
- Failed transactions
- Network errors
- Insufficient balance
- Wrong network

**Impact**: Poor UX during demo
**Fix**: Add error boundaries and toast notifications
**Time Estimate**: 3-4 hours
**Priority**: MEDIUM

---

### 8. Loading States Missing
**Files**: All pages

**Problem**: No loading spinners/skeletons for:
- Contract data fetching
- Transaction pending
- AI analysis in progress

**Impact**: Users don't know when app is working
**Fix**: Add loading states to all async operations
**Time Estimate**: 2-3 hours
**Priority**: MEDIUM

---

### 9. No Wallet Connection State Management
**Files**: `components/shared/WalletButton.tsx`

**Problem**: 
- No wallet detection (Keplr vs MetaMask)
- No network switching guidance
- No balance display

**Impact**: Confusing for users during demo
**Fix**: Add wallet detection and network guidance
**Priority**: MEDIUM

---

### 10. No Transaction Confirmations
**Files**: All pages

**Problem**: After transactions, no:
- Success notifications
- Explorer links
- Transaction hash display

**Impact**: Users don't know if tx succeeded
**Fix**: Add transaction toast with explorer link
**Priority**: MEDIUM

---

## 🔧 Low Priority (Optional)

### 11. No Unit Tests
**Files**: Missing `frontend/tests/`

**Problem**: Zero test coverage
**Impact**: Hard to catch bugs before demo
**Fix**: Add basic tests for critical paths
**Time Estimate**: 4-6 hours
**Priority**: LOW (focus on demo first)

---

### 12. No Responsive Design for Mobile
**Files**: All pages

**Problem**: UI optimized for desktop only
**Impact**: Can't demo on phone
**Fix**: Add mobile-responsive styles
**Time Estimate**: 3-4 hours
**Priority**: LOW (demo on desktop)

---

### 13. No Analytics/Tracking
**Files**: Missing

**Problem**: Can't track user behavior for hackathon metrics
**Impact**: No data on demo usage
**Fix**: Add simple analytics (Plausible/Umami)
**Priority**: LOW

---

## ✅ What's Working

### Contracts (100%)
- ✅ MindyVault deployed & working
- ✅ MindyStrategyManager deployed & working
- ✅ MindySessionKeyModule deployed & working
- ✅ MindyYieldRouter deployed (but stub implementation)

### Infrastructure (100%)
- ✅ mindy-1 rollup running on AWS EC2
- ✅ Public RPC endpoint: http://34.204.190.49:8545
- ✅ Systemd service for persistence
- ✅ Security groups configured

### Frontend UI (90%)
- ✅ All 4 pages built (Dashboard, Strategies, Bridge, Settings)
- ✅ Professional design with shadcn/ui
- ✅ Navigation working
- ✅ Wallet connection UI

### Backend (70%)
- ✅ Groq AI integration working
- ✅ API routes functional (`/api/ai/analyze`, `/api/ai/chat`)
- ✅ Mock data for demo
- ⚠️ Not connected to real contract data

---

## 🎯 Demo Day Checklist

### Must Have (For Winning Pitch):
- [ ] Connect wallet (InterwovenKit)
- [ ] Show portfolio balance (real data from vault)
- [ ] Run AI analysis (connect to real strategies)
- [ ] Grant session key (real transaction)
- [ ] Show AI rebalancing WITHOUT wallet popup (session key working)
- [ ] Display transaction on explorer
- [ ] Chat with AI about decision (build chat UI)

### Nice to Have:
- [ ] Bridge to another rollup (if Interwoven Bridge integration done)
- [ ] Show multiple transactions
- [ ] Display APY earned over time

---

## 📊 Priority Matrix

| Priority | Task | Time | Impact |
|----------|------|------|--------|
| **P0** | Connect frontend to real contracts | 4h | ⭐⭐⭐⭐⭐ |
| **P0** | Build Chat UI | 3h | ⭐⭐⭐⭐⭐ |
| **P0** | Connect session key UI | 2h | ⭐⭐⭐⭐⭐ |
| **P1** | Fix bridge router (real integration) | 6h | ⭐⭐⭐⭐ |
| **P1** | Add error handling | 3h | ⭐⭐⭐ |
| **P1** | Add loading states | 2h | ⭐⭐⭐ |
| **P2** | Add transaction confirmations | 2h | ⭐⭐ |
| **P2** | Improve wallet connection UX | 2h | ⭐⭐ |
| **P3** | Mobile responsive design | 3h | ⭐ |

---

## 🚀 Recommended Action Plan

### Today (Critical):
1. **Connect frontend to AWS RPC** (update `.env.local`)
2. **Build Chat UI** (3h)
3. **Connect session key transactions** (2h)
4. **Test full flow end-to-end** (1h)

### Tomorrow (High Priority):
5. **Connect AI to real contract data** (2h)
6. **Add error handling & loading states** (3h)
7. **Fix bridge router** (6h - optional if time)

### Day 3 (Polish):
8. **Record demo video** (2h)
9. **Write submission description** (2h)
10. **Submit to DoraHacks** (1h)

---

## 📞 Resources Needed

- **AWS EC2**: Running ($15/month or free tier)
- **Groq API**: Free tier (15k requests/day)
- **Vercel/Netlify**: Free for frontend hosting
- **Domain**: Optional (mindy.finance or similar)

---

**Last Deployment**: 2026-04-06  
**Rollup**: mindy-1 on AWS EC2 (34.204.190.49:8545)  
**GitHub**: https://github.com/Nathasan1410/Mindy
