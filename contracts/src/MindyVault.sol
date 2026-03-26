// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "./interfaces/IMindyStrategyManager.sol";

/**
 * @title MindyVault
 * @notice ERC4626-compliant vault for AI-powered yield optimization
 * @dev Users deposit tokens and receive shares; StrategyManager allocates funds
 */
contract MindyVault is ERC20, ERC4626, Ownable, ReentrancyGuard {
    // Strategy manager contract
    address public strategyManager;
    
    // Performance fee (2% = 200 basis points)
    uint256 public performanceFeeBps = 200;
    
    // Tracking
    uint256 public totalAllocated;
    uint256 public lastHarvestTimestamp;
    mapping(address => uint256) public userDeposits;
    
    // Events
    event Deposited(address indexed user, uint256 amount, uint256 shares);
    event Withdrawn(address indexed user, uint256 amount, uint256 shares);
    event Harvested(uint256 profit, uint256 fee);
    event StrategyManagerUpdated(address indexed oldManager, address indexed newManager);
    event PerformanceFeeUpdated(uint256 oldFee, uint256 newFee);
    event EmergencyWithdrawal(address indexed user, uint256 amount);
    
    modifier onlyStrategyManager() {
        require(msg.sender == strategyManager, "MindyVault: only strategy manager");
        _;
    }
    
    constructor(
        address _underlyingToken,
        address _initialOwner
    ) ERC20("Mindy Vault", "MINDY-VLT") ERC4626(IERC20(_underlyingToken)) Ownable(_initialOwner) {
        lastHarvestTimestamp = block.timestamp;
    }
    
    // ============ User Functions ============
    
    /**
     * @notice Deposit tokens into the vault
     * @param amount Amount of underlying tokens to deposit
     * @return shares Number of vault shares minted
     */
    function deposit(uint256 amount) public nonReentrant returns (uint256 shares) {
        shares = super.deposit(amount, msg.sender);
        userDeposits[msg.sender] += amount;
        emit Deposited(msg.sender, amount, shares);
    }

    /**
     * @notice Withdraw tokens from the vault
     * @param shares Number of vault shares to burn
     * @return amount Amount of underlying tokens withdrawn
     */
    function withdraw(uint256 shares) public nonReentrant returns (uint256 amount) {
        amount = super.withdraw(shares, msg.sender, msg.sender);
        userDeposits[msg.sender] = userDeposits[msg.sender] >= amount
            ? userDeposits[msg.sender] - amount
            : 0;
        emit Withdrawn(msg.sender, amount, shares);
    }
    
    /**
     * @notice Emergency withdrawal - bypasses normal restrictions
     * @param shares Number of shares to withdraw
     * @return amount Amount withdrawn
     */
    function emergencyWithdraw(uint256 shares) external nonReentrant returns (uint256 amount) {
        require(shares <= balanceOf(msg.sender), "MindyVault: insufficient shares");
        
        // Calculate proportional withdrawal (ignoring fees in emergency)
        uint256 totalSupply = totalSupply();
        require(totalSupply > 0, "MindyVault: no supply");
        
        amount = (shares * totalAssets()) / totalSupply;
        
        _burn(msg.sender, shares);
        IERC20(asset()).transfer(msg.sender, amount);
        
        emit EmergencyWithdrawal(msg.sender, amount);
    }
    
    // ============ Strategy Manager Functions ============
    
    /**
     * @notice Allocate funds to strategies
     * @dev Only callable by StrategyManager
     * @param amount Amount to allocate
     */
    function allocateToStrategy(uint256 amount) external onlyStrategyManager nonReentrant {
        require(amount <= totalAssets() - totalAllocated, "MindyVault: insufficient funds");
        totalAllocated += amount;
        
        // Transfer to strategy manager
        IERC20(asset()).transfer(strategyManager, amount);
    }
    
    /**
     * @notice Return funds from strategies
     * @dev Only callable by StrategyManager
     * @param amount Amount returned
     */
    function returnFromStrategy(uint256 amount) external onlyStrategyManager nonReentrant {
        totalAllocated = totalAllocated >= amount ? totalAllocated - amount : 0;
        
        // Receive tokens back
        IERC20(asset()).transferFrom(strategyManager, address(this), amount);
    }
    
    /**
     * @notice Harvest profits and charge performance fee
     * @dev Callable by anyone to trigger compounding
     */
    function harvest() external nonReentrant {
        uint256 totalBefore = totalAssets();
        
        // Calculate profit (simplified - in reality strategies would send profits back)
        uint256 profit = totalBefore > (totalAssets() - totalAllocated) 
            ? totalBefore - (totalAssets() - totalAllocated)
            : 0;
        
        if (profit > 0) {
            // Calculate and charge performance fee
            uint256 fee = (profit * performanceFeeBps) / 10000;
            
            // Transfer fee to owner (can be redirected to treasury)
            if (fee > 0) {
                IERC20(asset()).transfer(owner(), fee);
            }
            
            // Remaining profit stays in vault for compounding
            emit Harvested(profit, fee);
        }
        
        lastHarvestTimestamp = block.timestamp;
    }
    
    // ============ Owner Functions ============
    
    /**
     * @notice Set the strategy manager address
     * @param _strategyManager New strategy manager address
     */
    function setStrategyManager(address _strategyManager) external onlyOwner {
        require(_strategyManager != address(0), "MindyVault: zero address");
        emit StrategyManagerUpdated(strategyManager, _strategyManager);
        strategyManager = _strategyManager;
    }
    
    /**
     * @notice Update performance fee
     * @param _feeBps New fee in basis points (e.g., 200 = 2%)
     */
    function setPerformanceFee(uint256 _feeBps) external onlyOwner {
        require(_feeBps <= 1000, "MindyVault: fee too high"); // Max 10%
        emit PerformanceFeeUpdated(performanceFeeBps, _feeBps);
        performanceFeeBps = _feeBps;
    }
    
    // ============ View Functions ============

    /**
     * @notice Get the number of decimals for the vault token
     * @return Number of decimals
     */
    function decimals() public view override(ERC20, ERC4626) returns (uint8) {
        return super.decimals();
    }

    /**
     * @notice Get available funds for allocation
     * @return Available amount
     */
    function availableFunds() external view returns (uint256) {
        return totalAssets() - totalAllocated;
    }
    
    /**
     * @notice Get user's pending rewards (simplified)
     * @param user User address
     * @return Pending amount
     */
    function pendingRewards(address user) external view returns (uint256) {
        uint256 userShares = balanceOf(user);
        if (userShares == 0) return 0;
        
        // Proportional share of unharvested profits
        uint256 totalSupply = totalSupply();
        if (totalSupply == 0) return 0;
        
        return (userShares * (totalAssets() - totalAllocated)) / totalSupply;
    }
}
