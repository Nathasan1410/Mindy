// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "./interfaces/IMindyVault.sol";

/**
 * @title MindyStrategyManager
 * @notice AI-controlled strategy registry and allocation manager
 * @dev Manages yield strategies and executes rebalancing via AI agent
 */
contract MindyStrategyManager is Ownable, ReentrancyGuard {
    using EnumerableSet for EnumerableSet.UintSet;
    
    // Strategy struct
    struct Strategy {
        uint256 id;
        string name;
        address targetContract;
        uint256 rollupChainId;
        uint256 targetAPY;
        uint256 riskScore; // 0-100
        uint256 currentAllocation;
        bool isActive;
        string reasoning; // AI's reasoning for this allocation
    }
    
    // Allocation for rebalancing
    struct StrategyAllocation {
        uint256 strategyId;
        uint256 allocationBps; // Basis points (10000 = 100%)
    }
    
    // State
    uint256 public strategyCount;
    mapping(uint256 => Strategy) public strategies;
    EnumerableSet.UintSet private activeStrategyIds;
    
    // Addresses
    IMindyVault public vault;
    address public aiOperator; // AI agent address with rebalance permission
    
    // Events
    event StrategyAdded(uint256 indexed strategyId, string name, uint256 rollupChainId);
    event StrategyUpdated(uint256 indexed strategyId, uint256 targetAPY, uint256 riskScore);
    event StrategyRebalanced(uint256[] strategyIds, uint256[] allocations, uint256 timestamp);
    event RiskScoreUpdated(uint256 indexed strategyId, uint256 oldScore, uint256 newScore, string reasoning);
    event AIOperatorUpdated(address indexed oldOperator, address indexed newOperator);
    event VaultUpdated(address indexed oldVault, address indexed newVault);
    event Harvested(uint256 indexed strategyId, uint256 profit);
    event FundsBridged(uint256 indexed strategyId, uint256 amount, uint256 destChainId);
    
    modifier onlyAIOperator() {
        require(msg.sender == aiOperator || msg.sender == owner(), "MindySM: not AI operator");
        _;
    }
    
    constructor(address _initialOwner) Ownable(_initialOwner) {
        aiOperator = _initialOwner;
    }
    
    // ============ Strategy Management ============
    
    /**
     * @notice Add a new yield strategy
     * @param name Strategy name
     * @param targetContract Target DeFi protocol address
     * @param rollupChainId Chain ID where strategy operates
     * @param targetAPY Expected APY (basis points)
     * @param initialRiskScore Initial risk score (0-100)
     * @return strategyId New strategy ID
     */
    function addStrategy(
        string memory name,
        address targetContract,
        uint256 rollupChainId,
        uint256 targetAPY,
        uint256 initialRiskScore
    ) external onlyOwner returns (uint256) {
        require(initialRiskScore <= 100, "MindySM: invalid risk score");
        
        uint256 strategyId = strategyCount++;
        
        strategies[strategyId] = Strategy({
            id: strategyId,
            name: name,
            targetContract: targetContract,
            rollupChainId: rollupChainId,
            targetAPY: targetAPY,
            riskScore: initialRiskScore,
            currentAllocation: 0,
            isActive: true,
            reasoning: "Initial strategy added"
        });
        
        activeStrategyIds.add(strategyId);
        
        emit StrategyAdded(strategyId, name, rollupChainId);
        return strategyId;
    }
    
    /**
     * @notice Update strategy parameters
     * @param strategyId Strategy ID to update
     * @param targetAPY New target APY
     * @param riskScore New risk score
     */
    function updateStrategy(
        uint256 strategyId,
        uint256 targetAPY,
        uint256 riskScore
    ) external onlyOwner {
        require(strategies[strategyId].id != 0, "MindySM: invalid strategy");
        require(riskScore <= 100, "MindySM: invalid risk score");
        
        strategies[strategyId].targetAPY = targetAPY;
        strategies[strategyId].riskScore = riskScore;
        
        emit StrategyUpdated(strategyId, targetAPY, riskScore);
    }
    
    /**
     * @notice Update AI's risk assessment and reasoning
     * @param strategyId Strategy ID
     * @param newScore New risk score (0-100)
     * @param reasoning AI's reasoning for the score
     */
    function updateRiskScore(
        uint256 strategyId,
        uint256 newScore,
        string memory reasoning
    ) external onlyAIOperator {
        require(strategies[strategyId].id != 0, "MindySM: invalid strategy");
        require(newScore <= 100, "MindySM: invalid risk score");
        
        uint256 oldScore = strategies[strategyId].riskScore;
        strategies[strategyId].riskScore = newScore;
        strategies[strategyId].reasoning = reasoning;
        
        emit RiskScoreUpdated(strategyId, oldScore, newScore, reasoning);
    }
    
    /**
     * @notice Activate or deactivate a strategy
     * @param strategyId Strategy ID
     * @param isActive New active status
     */
    function setStrategyActive(uint256 strategyId, bool isActive) external onlyOwner {
        require(strategies[strategyId].id != 0, "MindySM: invalid strategy");
        
        strategies[strategyId].isActive = isActive;
        
        if (isActive) {
            activeStrategyIds.add(strategyId);
        } else {
            activeStrategyIds.remove(strategyId);
        }
    }
    
    // ============ Rebalancing ============
    
    /**
     * @notice Execute AI-driven portfolio rebalancing
     * @dev Allocates vault funds according to AI's optimal allocation
     * @param allocations Array of (strategyId, allocationBps) pairs
     */
    function rebalance(
        StrategyAllocation[] calldata allocations
    ) external onlyAIOperator nonReentrant {
        require(address(vault) != address(0), "MindySM: vault not set");
        require(allocations.length > 0, "MindySM: empty allocations");
        
        // Validate total allocation = 10000 bps (100%)
        uint256 totalBps = 0;
        for (uint256 i = 0; i < allocations.length; i++) {
            require(strategies[allocations[i].strategyId].id != 0, "MindySM: invalid strategy");
            require(strategies[allocations[i].strategyId].isActive, "MindySM: strategy inactive");
            totalBps += allocations[i].allocationBps;
        }
        require(totalBps == 10000, "MindySM: allocations must sum to 10000");
        
        // Get available funds from vault
        uint256 availableFunds = vault.availableFunds();
        require(availableFunds > 0, "MindySM: no available funds");
        
        // Execute allocations
        uint256[] memory strategyIds = new uint256[](allocations.length);
        uint256[] memory newAllocations = new uint256[](allocations.length);
        
        for (uint256 i = 0; i < allocations.length; i++) {
            uint256 strategyId = allocations[i].strategyId;
            uint256 allocationBps = allocations[i].allocationBps;
            
            // Calculate amount for this strategy
            uint256 amount = (availableFunds * allocationBps) / 10000;
            
            if (amount > 0) {
                // Update strategy allocation
                strategies[strategyId].currentAllocation = amount;
                
                // Allocate from vault
                vault.allocateToStrategy(amount);
                
                // Here you would integrate with actual yield protocols
                // For hackathon demo: funds are held in this contract
                
                strategyIds[i] = strategyId;
                newAllocations[i] = allocationBps;
            }
        }
        
        emit StrategyRebalanced(strategyIds, newAllocations, block.timestamp);
    }
    
    // ============ Harvesting ============
    
    /**
     * @notice Harvest profits from a strategy
     * @param strategyId Strategy ID to harvest
     */
    function harvest(uint256 strategyId) external nonReentrant {
        require(strategies[strategyId].id != 0, "MindySM: invalid strategy");
        
        // Simplified: In production, this would interact with the actual DeFi protocol
        // For demo: we just emit an event
        
        uint256 profit = 0; // Would be calculated from protocol
        
        emit Harvested(strategyId, profit);
        
        // Return funds to vault
        if (strategies[strategyId].currentAllocation > 0) {
            vault.returnFromStrategy(strategies[strategyId].currentAllocation);
        }
    }
    
    // ============ Bridge Integration ============
    
    /**
     * @notice Bridge funds to another rollup for a strategy
     * @param strategyId Strategy ID
     * @param amount Amount to bridge
     * @param destChainId Destination chain ID
     */
    function bridgeToRollup(
        uint256 strategyId,
        uint256 amount,
        uint256 destChainId
    ) external onlyAIOperator {
        require(strategies[strategyId].id != 0, "MindySM: invalid strategy");
        require(amount > 0, "MindySM: zero amount");
        
        // Update allocation
        strategies[strategyId].currentAllocation += amount;
        
        // In production: call Initia Interwoven Bridge here
        // For demo: just emit event
        
        emit FundsBridged(strategyId, amount, destChainId);
    }
    
    // ============ Admin Functions ============
    
    /**
     * @notice Set the vault address
     * @param _vault Vault contract address
     */
    function setVault(address _vault) external onlyOwner {
        require(_vault != address(0), "MindySM: zero address");
        emit VaultUpdated(address(vault), _vault);
        vault = IMindyVault(_vault);
    }
    
    /**
     * @notice Update AI operator address
     * @param _aiOperator New AI operator address
     */
    function setAIOperator(address _aiOperator) external onlyOwner {
        require(_aiOperator != address(0), "MindySM: zero address");
        emit AIOperatorUpdated(aiOperator, _aiOperator);
        aiOperator = _aiOperator;
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Get all active strategies
     * @return Array of strategy IDs
     */
    function getActiveStrategies() external view returns (uint256[] memory) {
        uint256 count = activeStrategyIds.length();
        uint256[] memory ids = new uint256[](count);
        
        for (uint256 i = 0; i < count; i++) {
            ids[i] = activeStrategyIds.at(i);
        }
        
        return ids;
    }
    
    /**
     * @notice Get strategy details
     * @param strategyId Strategy ID
     * @return Strategy struct
     */
    function getStrategy(uint256 strategyId) external view returns (Strategy memory) {
        return strategies[strategyId];
    }
    
    /**
     * @notice Get total number of strategies
     * @return Strategy count
     */
    function getStrategyCount() external view returns (uint256) {
        return strategyCount;
    }
}
