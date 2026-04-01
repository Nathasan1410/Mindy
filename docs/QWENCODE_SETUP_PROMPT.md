# QwenCode Setup Prompt - Clone and Deploy Mindy

Use this prompt with QwenCode in WSL to clone and set up Mindy from GitHub.

---

## 🚀 Main Setup Prompt

Copy and paste this entire prompt into QwenCode:

```
Help me clone and set up Mindy (AI-Powered Yield Optimizer) from GitHub:

### Step 1: Clone Repository
1. Clone the repository:
   ```bash
   git clone https://github.com/Nathasan1410/Mindy.git
   cd Mindy
   ```

### Step 2: Check Prerequisites
2. Verify all required tools are installed:
   - Go version (need 1.22+): `go version`
   - Foundry: `forge --version`
   - Docker: `docker --version`
   - Node.js: `node --version`
   - pnpm: `pnpm --version`
   
3. If Go is not installed:
   ```bash
   curl -LO https://go.dev/dl/go1.22.0.linux-amd64.tar.gz
   sudo tar -C /usr/local -xzf go1.22.0.linux-amd64.tar.gz
   export PATH=$PATH:/usr/local/go/bin
   echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
   ```

4. If Foundry is not installed:
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   source ~/.bashrc
   foundryup
   ```

### Step 3: Install Dependencies
5. Install Node.js dependencies:
   ```bash
   pnpm install
   ```

6. Install Foundry dependencies:
   ```bash
   cd contracts
   forge install OpenZeppelin/openzeppelin-contracts --no-commit
   forge install foundry-rs/forge-std --no-commit
   cd ..
   ```

### Step 4: Environment Setup
7. Create .env.local from .env.example:
   ```bash
   cp .env.example .env.local
   ```

8. Tell me to edit .env.local and add:
   - GROQ_API_KEY (get from https://console.groq.com/keys)
   - Or QWEN_API_KEY (get from Alibaba ModelStudio)

### Step 5: Build Contracts
9. Compile smart contracts:
   ```bash
   cd contracts
   forge build
   ```

10. Run tests if available:
    ```bash
    forge test
    ```

### Step 6: Deploy Appchain
11. Deploy Initia appchain:
    ```bash
    bash scripts/deploy-appchain.sh
    ```
    
12. Follow the interactive setup:
    - Select EVM track
    - Generate new gas station account
    - Fund via https://faucet.initia.xyz
    - Set chain name: "Mindy"

### Step 7: Deploy Contracts
13. Deploy smart contracts:
    ```bash
    bash scripts/deploy-contracts.sh
    ```

14. Copy the deployed contract addresses to .env.local

### Step 8: Copy ABIs
15. Copy contract ABIs to frontend:
    ```bash
    bash scripts/copy-abis.sh
    ```

### Step 9: Start Frontend
16. Start the development server:
    ```bash
    pnpm dev
    ```

17. Verify the app is running at http://localhost:3000

### Step 10: Verify Setup
18. Test the setup:
    - Check appchain status: `weave status`
    - Check frontend is running
    - Test API: `curl http://localhost:3000/api/yields`
    
### Report Back
After completing all steps, provide me with:
1. ✅ All successfully completed steps
2. ⚠️ Any errors or warnings encountered
3. 📝 Contract addresses (if deployed)
4. 🔗 RPC URL and Chain ID
5. 🌐 Frontend URL
6. 💡 Next steps or issues to fix
```

---

## 🔑 API Keys You Need

### 1. **Groq API Key** (Recommended - FREE)
- **What**: AI inference for yield analysis and chat
- **Get it at**: https://console.groq.com/keys
- **Free Tier**: Yes, generous limits
- **Models**: Llama 3.1 70B and 8B
- **Add to .env.local**: `GROQ_API_KEY=gsk_xxxxxxxxxxxxx`

### 2. **Alibaba ModelStudio API Key** (Alternative)
- **What**: Alternative AI provider (Qwen models)
- **Get it at**: https://help.aliyun.com/zh/model-studio/
- **Free Tier**: Check current offerings
- **Models**: Qwen-72B, Qwen-14B, etc.
- **Add to .env.local**: `QWEN_API_KEY=xxxxxxxxxxxxx`

### 3. **Initia Testnet Faucet** (For gas)
- **What**: Free INIT tokens for testnet gas
- **Get it at**: https://faucet.initia.xyz
- **Cost**: Free
- **When needed**: After running `weave init`

---

## 📝 .env.local Template

After cloning, create `.env.local` with:

```bash
# AI Provider - CHOOSE ONE

# Option 1: Groq (Recommended)
GROQ_API_KEY=gsk_your_actual_key_here

# Option 2: Alibaba Qwen
# QWEN_API_KEY=your_actual_key_here

# Frontend Config
NEXT_PUBLIC_APP_NAME=Mindy
NEXT_PUBLIC_CHAIN_NAME=Mindy
NEXT_PUBLIC_RPC_URL=http://localhost:26657
NEXT_PUBLIC_CHAIN_ID=mindy-local

# Contract Addresses (auto-filled after deployment)
MINDY_VAULT_ADDRESS=0x...
MINDY_STRATEGY_MANAGER_ADDRESS=0x...
MINDY_SESSION_KEY_MODULE_ADDRESS=0x...
MINDY_YIELD_ROUTER_ADDRESS=0x...

# AI Agent Wallet (generated during deployment)
AI_AGENT_PRIVATE_KEY=0x...

# Initia Config
INITIA_NETWORK_TYPE=testnet
INITIA_GAS_STATION_ADDRESS=0x...
```

---

## ⚡ Quick Start (After Cloning)

If you already have API keys and tools installed:

```bash
# 1. Clone
git clone https://github.com/Nathasan1410/Mindy.git
cd Mindy

# 2. Install dependencies
pnpm install
cd contracts && forge install OpenZeppelin/openzeppelin-contracts --no-commit && cd ..

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local and add your GROQ_API_KEY

# 4. Deploy everything
bash scripts/setup.sh

# 5. Start frontend
pnpm dev
```

---

## 🆘 Troubleshooting

### "Go not found"
```bash
curl -LO https://go.dev/dl/go1.22.0.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.22.0.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin
```

### "forge: command not found"
```bash
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc
foundryup
```

### "Docker not running"
- Start Docker Desktop on Windows
- Wait for whale icon to stop animating
- Try WSL commands again

### "pnpm: command not found"
```bash
npm install -g pnpm
```

### "Cannot find module '@initia/interwovenkit-react'"
```bash
cd frontend
pnpm install
cd ..
```

---

## 📚 Additional Resources

- **Main Documentation**: README.md
- **Build Summary**: docs/BUILD_SUMMARY.md
- **All QwenCode Prompts**: docs/WSL_QWENCODE_PROMPTS.md
- **GitHub Repo**: https://github.com/Nathasan1410/Mindy
- **Initia Docs**: https://docs.initia.xyz
- **Groq Console**: https://console.groq.com

---

**Ready to deploy Mindy!** 🚀

Just copy the main setup prompt above and paste it into QwenCode in WSL.
