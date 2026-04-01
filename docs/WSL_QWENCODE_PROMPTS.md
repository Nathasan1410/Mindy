# QwenCode Automation Prompts for Mindy

Use these prompts with QwenCode in WSL to automate Mindy deployment and testing.

---

## 🚀 Setup & Deployment

### Prompt 1: Initialize Foundry Project
```
Set up the Foundry project in /mnt/d/Projekan/Macam2Hackathon/Initiate/contracts:

1. Navigate to the contracts directory
2. Initialize Foundry if not done: forge init . --no-commit
3. Install OpenZeppelin: forge install OpenZeppelin/openzeppelin-contracts --no-commit
4. Install forge-std: forge install foundry-rs/forge-std --no-commit
5. Verify directory structure: src/, test/, script/, lib/
6. Run forge build and show results
7. Report any compilation errors
```

### Prompt 2: Build and Test Contracts
```
Build and test all Mindy smart contracts:

1. Navigate to /mnt/d/Projekan/Macam2Hackathon/Initiate/contracts
2. Run: forge build --verbose
3. Show compilation output and any warnings
4. Run: forge test --gas-report
5. Display test results for each contract:
   - MindyVault.t.sol
   - MindyStrategyManager.t.sol
   - MindySessionKeyModule.t.sol
   - MindyYieldRouter.t.sol
6. If tests fail, explain what needs to be fixed
7. Show gas report summary
```

### Prompt 3: Deploy Initia Appchain
```
Deploy Mindy Initia appchain using Weave CLI:

1. Check if weave CLI is installed: weave --version
2. If not installed: go install github.com/initia-labs/weave/cmd/weave@latest
3. Navigate to /mnt/d/Projekan/Macam2Hackathon/Initiate
4. Check if .weave config exists
5. If not, guide me through: weave init
   - Select EVM track
   - Generate new gas station account
   - Show the address for faucet funding
6. Start executor: weave opinit start executor -d
7. Start relayer: weave relayer start -d
8. Wait 10 seconds for services
9. Run: weave status
10. Extract and display:
    - Chain ID
    - RPC URL
    - Gas station address
11. Save these values for .env.local configuration
```

### Prompt 4: Deploy Smart Contracts
```
Deploy Mindy contracts to Initia appchain:

1. Navigate to /mnt/d/Projekan/Macam2Hackathon/Initiate/contracts
2. Ensure contracts are compiled: forge build
3. Get RPC URL and Chain ID from ../.weave/config.json
4. For each contract in order:
   a. MindyVault.sol
   b. MindyStrategyManager.sol  
   c. MindySessionKeyModule.sol
   d. MindyYieldRouter.sol
   
   Extract bytecode from out/ directory
   Deploy using: minitiad tx evm create --bytecode <hex> --rpc <rpc-url>
   
5. Save deployed addresses to ../deployments.json
6. Display all contract addresses
7. Verify each deployment with: minitiad eth call
```

### Prompt 5: Copy ABIs to Frontend
```
Copy contract ABIs to frontend:

1. Navigate to /mnt/d/Projekan/Macam2Hackathon/Initiate
2. Create frontend/abis directory if needed
3. Copy from contracts/out/:
   - MindyVault.sol/MindyVault.json → frontend/abis/MindyVault.json
   - MindyStrategyManager.sol/MindyStrategyManager.json → frontend/abis/
   - MindySessionKeyModule.sol/MindySessionKeyModule.json → frontend/abis/
   - MindyYieldRouter.sol/MindyYieldRouter.json → frontend/abis/
4. Verify all 4 ABI files exist
5. Show file sizes to confirm they're not empty
6. Display directory structure of frontend/abis/
```

---

## 🔍 Testing & Verification

### Prompt 6: Full Integration Test
```
Run full integration test of Mindy:

1. Check appchain status: weave status
2. Verify contracts are deployed: cat deployments.json
3. Check frontend ABIs exist: ls -la frontend/abis/
4. Verify .env.local exists with:
   - GROQ_API_KEY
   - Contract addresses
   - RPC URL
5. Navigate to frontend directory
6. Install dependencies: pnpm install
7. Start dev server: pnpm dev
8. Check if server is running on port 3000
9. Test API endpoints:
   - curl http://localhost:3000/api/yields
   - curl -X POST http://localhost:3000/api/ai/analyze -H "Content-Type: application/json" -d '{"opportunities":[]}'
10. Report any errors
```

### Prompt 7: Check Contract Interactions
```
Test contract interactions on Initia appchain:

1. Get MindyVault address from deployments.json
2. Check vault balance: minitiad eth balance <address>
3. Call view function: minitiad eth call --to <vault> --data "availableFunds()"
4. Get StrategyManager address
5. Check active strategies: minitiad eth call --to <manager> --data "getActiveStrategies()"
6. Get SessionKeyModule address
7. Check if sessions can be created (view function)
8. Report all results
```

---

## 🐛 Debugging

### Prompt 8: Debug Compilation Errors
```
Debug Foundry compilation errors:

1. Run: forge build --force --verbose
2. Capture full error output
3. For each error:
   - Show file path and line number
   - Show the erroring code
   - Explain what the error means
   - Suggest the fix
4. Check if remappings.txt is correct
5. Verify OpenZeppelin is installed: ls lib/openzeppelin-contracts/
6. Check Solidity version in foundry.toml
7. After fixes, re-run: forge build
```

### Prompt 9: Debug Deployment Issues
```
Debug Initia deployment issues:

1. Check Weave CLI: weave --version
2. Check appchain status: weave status
3. If services not running:
   - weave opinit start executor -d
   - weave relayer start -d
4. Check gas station balance
5. If balance is 0, guide to faucet: https://faucet.initia.xyz
6. Verify RPC endpoint is accessible: curl <rpc-url>
7. Check minitiad is available: minitiad version
8. Test contract deployment with simple contract first
9. Show detailed error messages from deployment
```

### Prompt 10: Debug Frontend Connection
```
Debug frontend connection to Initia:

1. Check .env.local exists and has:
   - NEXT_PUBLIC_RPC_URL
   - NEXT_PUBLIC_CHAIN_ID
   - Contract addresses
2. Verify InterwovenKit is installed: pnpm list @initia/interwovenkit-react
3. Check providers.tsx configuration
4. Verify ABI files are valid JSON: jq . frontend/abis/*.json
5. Test wallet connection in browser console
6. Check for CORS errors in browser console
7. Verify appchain is running: weave status
8. Test RPC call: curl -X POST <rpc-url> -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"eth_chainId","id":1}'
```

---

## 📊 Monitoring

### Prompt 11: Monitor Appchain Health
```
Monitor Mindy appchain health:

1. Check weave services: weave status
2. Show block height: weave chain height
3. Check executor logs: docker logs weave-executor
4. Check relayer logs: docker logs weave-relayer
5. Monitor pending transactions
6. Check gas station balance
7. Report any errors or warnings
8. Suggest optimizations if needed
```

### Prompt 12: Analyze Gas Usage
```
Analyze gas usage for Mindy contracts:

1. Run: forge test --gas-report --match-test testDeployment
2. Show gas cost for each contract deployment
3. Run function-level gas tests
4. Compare gas costs:
   - deposit()
   - withdraw()
   - rebalance()
   - grantSession()
5. Identify expensive operations
6. Suggest optimizations
7. Compare with Initia mainnet averages
```

---

## 🎯 Quick Commands Reference

```bash
# Compilation
forge build
forge build --force
forge build --sizes

# Testing
forge test
forge test -vvv
forge test --gas-report

# Deployment
weave init
weave opinit start executor -d
weave relayer start -d
weave status

# Contract Interaction
minitiad tx evm create --bytecode <hex>
minitiad eth call --to <address> --data "<function>"
minitiad eth balance <address>

# Frontend
pnpm install
pnpm dev
pnpm build
pnpm lint

# Utilities
cd /mnt/d/Projekan/Macam2Hackathon/Initiate
bash scripts/setup.sh
bash scripts/deploy-appchain.sh
bash scripts/deploy-contracts.sh
bash scripts/copy-abis.sh
```

---

## 🎓 Learning Resources

If you encounter issues, check:

1. **Initia Docs**: https://docs.initia.xyz
2. **Foundry Book**: https://book.getfoundry.sh
3. **Weave CLI**: https://docs.initia.xyz/developers/tools/weave-cli
4. **Solidity Docs**: https://docs.soliditylang.org

---

**Tip**: Always run these prompts in WSL, not Windows PowerShell, for best compatibility with blockchain tools.
