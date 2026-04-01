// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IMindyYieldRouter
 * @notice Interface for MindyYieldRouter contract
 */
interface IMindyYieldRouter {
    enum TransferStatus {
        Pending,
        Completed,
        Failed,
        Refunded
    }
    
    struct BridgeTransfer {
        bytes32 transferId;
        address initiator;
        uint256 amount;
        uint256 sourceChainId;
        uint256 destChainId;
        address destStrategy;
        uint256 timestamp;
        TransferStatus status;
        bytes32 sourceTxHash;
        bytes32 destTxHash;
    }
    
    function bridgeToRollup(
        uint256 amount,
        uint256 destChainId,
        address destStrategy
    ) external returns (bytes32);
    
    function confirmTransfer(bytes32 transferId, bytes32 destTxHash) external;
    function failTransfer(bytes32 transferId, string memory reason) external;
    function getTransfer(bytes32 transferId) external view returns (BridgeTransfer memory);
    function getPendingTransfers() external view returns (bytes32[] memory);
    function calculateBridgeFee(uint256 amount) external view returns (uint256);
}
