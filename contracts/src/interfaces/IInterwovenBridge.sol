// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IInterwovenBridge
 * @notice Interface for Initia Interwoven Bridge
 * @dev Placeholder - replace with actual Initia bridge interface
 */
interface IInterwovenBridge {
    function bridge(
        uint256 destChainId,
        address destAddress,
        uint256 amount,
        bytes32 transferId
    ) external payable;
    
    function confirmTransfer(
        bytes32 transferId,
        bytes32 destTxHash
    ) external;
}
