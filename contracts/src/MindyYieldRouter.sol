// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "./interfaces/IMindyVault.sol";

/**
 * @title MindyYieldRouter
 * @notice Cross-rollup yield routing via Initia Interwoven Bridge
 * @dev Orchestrates bridge transfers to optimize yields across Initia ecosystem
 */
contract MindyYieldRouter is Ownable, ReentrancyGuard {
    using EnumerableSet for EnumerableSet.Bytes32Set;
    
    // Bridge transfer status
    enum TransferStatus {
        Pending,
        Completed,
        Failed,
        Refunded
    }
    
    // Bridge transfer record
    struct BridgeTransfer {
        bytes32 transferId;
        address initiator;      // Who initiated (user or AI agent)
        uint256 amount;
        uint256 sourceChainId;
        uint256 destChainId;
        address destStrategy;   // Target strategy on destination chain
        uint256 timestamp;
        TransferStatus status;
        bytes32 sourceTxHash;
        bytes32 destTxHash;
    }
    
    // State
    mapping(bytes32 => BridgeTransfer) public transfers;
    EnumerableSet.Bytes32Set private pendingTransfers;
    
    // Addresses
    IMindyVault public vault;
    address public bridgeContract; // Initia Interwoven Bridge address
    address public aiOperator;     // AI agent address
    
    // Fees
    uint256 public bridgeFeeBps = 50; // 0.5% bridge fee (example)
    
    // Events
    event BridgeTransferInitiated(
        bytes32 indexed transferId,
        address indexed initiator,
        uint256 amount,
        uint256 sourceChainId,
        uint256 destChainId,
        address destStrategy
    );
    event BridgeTransferCompleted(bytes32 indexed transferId, bytes32 destTxHash);
    event BridgeTransferFailed(bytes32 indexed transferId, string reason);
    event BridgeTransferRefunded(bytes32 indexed transferId);
    event BridgeContractUpdated(address indexed oldBridge, address indexed newBridge);
    event AIOperatorUpdated(address indexed oldOperator, address indexed newOperator);
    event BridgeFeeUpdated(uint256 oldFee, uint256 newFee);
    event TokensReceived(bytes32 indexed transferId, uint256 amount);
    
    modifier onlyAIOperator() {
        require(msg.sender == aiOperator || msg.sender == owner(), "MindyRouter: not AI operator");
        _;
    }
    
    modifier onlyBridge() {
        require(msg.sender == bridgeContract, "MindyRouter: not bridge");
        _;
    }
    
    constructor(address _initialOwner) Ownable(_initialOwner) {
        aiOperator = _initialOwner;
    }
    
    // ============ Bridge Functions ============
    
    /**
     * @notice Initiate a bridge transfer to another rollup
     * @param amount Amount to bridge
     * @param destChainId Destination chain ID
     * @param destStrategy Target strategy address on destination chain
     * @return transferId Unique transfer identifier
     */
    function bridgeToRollup(
        uint256 amount,
        uint256 destChainId,
        address destStrategy
    ) external onlyAIOperator nonReentrant returns (bytes32) {
        require(amount > 0, "MindyRouter: zero amount");
        require(destStrategy != address(0), "MindyRouter: zero strategy");
        require(vault.availableFunds() >= amount, "MindyRouter: insufficient funds");
        
        // Generate unique transfer ID
        bytes32 transferId = keccak256(
            abi.encodePacked(
                msg.sender,
                amount,
                destChainId,
                destStrategy,
                block.timestamp,
                block.number
            )
        );
        
        // Create transfer record
        transfers[transferId] = BridgeTransfer({
            transferId: transferId,
            initiator: msg.sender,
            amount: amount,
            sourceChainId: block.chainid,
            destChainId: destChainId,
            destStrategy: destStrategy,
            timestamp: block.timestamp,
            status: TransferStatus.Pending,
            sourceTxHash: bytes32(0),
            destTxHash: bytes32(0)
        });
        
        pendingTransfers.add(transferId);
        
        // Allocate funds from vault
        vault.allocateToStrategy(amount);
        
        // In production: Call Initia Interwoven Bridge here
        // Example:
        // IInterwovenBridge(bridgeContract).bridge{value: amount}(
        //     destChainId,
        //     destStrategy,
        //     amount,
        //     transferId
        // );
        
        // For hackathon demo: emit event
        emit BridgeTransferInitiated(
            transferId,
            msg.sender,
            amount,
            block.chainid,
            destChainId,
            destStrategy
        );
        
        return transferId;
    }
    
    /**
     * @notice Confirm a bridge transfer completion
     * @dev Called by bridge contract when funds arrive on destination
     * @param transferId Transfer ID to confirm
     * @param destTxHash Destination chain transaction hash
     */
    function confirmTransfer(
        bytes32 transferId,
        bytes32 destTxHash
    ) external onlyBridge {
        require(transfers[transferId].transferId != bytes32(0), "MindyRouter: invalid transfer");
        require(transfers[transferId].status == TransferStatus.Pending, "MindyRouter: not pending");
        
        transfers[transferId].status = TransferStatus.Completed;
        transfers[transferId].destTxHash = destTxHash;
        
        pendingTransfers.remove(transferId);
        
        emit BridgeTransferCompleted(transferId, destTxHash);
    }
    
    /**
     * @notice Mark a transfer as failed
     * @param transferId Transfer ID
     * @param reason Failure reason
     */
    function failTransfer(
        bytes32 transferId,
        string memory reason
    ) external onlyBridge {
        require(transfers[transferId].transferId != bytes32(0), "MindyRouter: invalid transfer");
        require(transfers[transferId].status == TransferStatus.Pending, "MindyRouter: not pending");
        
        transfers[transferId].status = TransferStatus.Failed;
        
        pendingTransfers.remove(transferId);
        
        // Return funds to vault
        vault.returnFromStrategy(transfers[transferId].amount);
        
        emit BridgeTransferFailed(transferId, reason);
    }
    
    /**
     * @notice Handle incoming tokens from another rollup
     * @dev Called by bridge contract when tokens arrive
     * @param transferId Transfer ID
     * @param amount Amount received
     */
    function onTokensReceived(
        bytes32 transferId,
        uint256 amount
    ) external onlyBridge {
        require(transfers[transferId].transferId != bytes32(0), "MindyRouter: invalid transfer");
        
        emit TokensReceived(transferId, amount);
        
        // In production: Deploy to destination strategy here
        // For demo: funds remain in contract
    }
    
    // ============ Admin Functions ============
    
    /**
     * @notice Set the vault address
     * @param _vault Vault contract address
     */
    function setVault(address _vault) external onlyOwner {
        require(_vault != address(0), "MindyRouter: zero address");
        vault = IMindyVault(_vault);
    }
    
    /**
     * @notice Set the bridge contract address
     * @param _bridge Bridge contract address
     */
    function setBridgeContract(address _bridge) external onlyOwner {
        require(_bridge != address(0), "MindyRouter: zero address");
        emit BridgeContractUpdated(bridgeContract, _bridge);
        bridgeContract = _bridge;
    }
    
    /**
     * @notice Update AI operator address
     * @param _aiOperator New AI operator address
     */
    function setAIOperator(address _aiOperator) external onlyOwner {
        require(_aiOperator != address(0), "MindyRouter: zero address");
        emit AIOperatorUpdated(aiOperator, _aiOperator);
        aiOperator = _aiOperator;
    }
    
    /**
     * @notice Update bridge fee
     * @param _feeBps New fee in basis points
     */
    function setBridgeFee(uint256 _feeBps) external onlyOwner {
        require(_feeBps <= 1000, "MindyRouter: fee too high"); // Max 10%
        emit BridgeFeeUpdated(bridgeFeeBps, _feeBps);
        bridgeFeeBps = _feeBps;
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Get all pending transfers
     * @return Array of transfer IDs
     */
    function getPendingTransfers() external view returns (bytes32[] memory) {
        uint256 count = pendingTransfers.length();
        bytes32[] memory ids = new bytes32[](count);
        
        for (uint256 i = 0; i < count; i++) {
            ids[i] = pendingTransfers.at(i);
        }
        
        return ids;
    }
    
    /**
     * @notice Get transfer details
     * @param transferId Transfer ID
     * @return BridgeTransfer struct
     */
    function getTransfer(bytes32 transferId) external view returns (BridgeTransfer memory) {
        return transfers[transferId];
    }
    
    /**
     * @notice Get transfer status
     * @param transferId Transfer ID
     * @return TransferStatus enum value
     */
    function getTransferStatus(bytes32 transferId) external view returns (TransferStatus) {
        return transfers[transferId].status;
    }
    
    /**
     * @notice Calculate bridge fee for an amount
     * @param amount Amount to bridge
     * @return Fee amount
     */
    function calculateBridgeFee(uint256 amount) external view returns (uint256) {
        return (amount * bridgeFeeBps) / 10000;
    }
}
