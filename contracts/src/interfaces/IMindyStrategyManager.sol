// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IMindyStrategyManager
 * @notice Interface for MindyStrategyManager contract
 */
interface IMindyStrategyManager {
    struct Strategy {
        uint256 id;
        string name;
        address targetContract;
        uint256 rollupChainId;
        uint256 targetAPY;
        uint256 riskScore;
        uint256 currentAllocation;
        bool isActive;
        string reasoning;
    }
    
    struct StrategyAllocation {
        uint256 strategyId;
        uint256 allocationBps;
    }
    
    function getStrategy(uint256 strategyId) external view returns (Strategy memory);
    function getActiveStrategies() external view returns (uint256[] memory);
    function getStrategyCount() external view returns (uint256);
    function rebalance(StrategyAllocation[] calldata allocations) external;
    function harvest(uint256 strategyId) external;
    function bridgeToRollup(uint256 strategyId, uint256 amount, uint256 destChainId) external;
}
