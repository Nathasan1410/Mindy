// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IMindySessionKeyModule
 * @notice Interface for MindySessionKeyModule contract
 */
interface IMindySessionKeyModule {
    struct Session {
        address agent;
        uint256 maxAmount;
        uint256 spent;
        uint256 expiry;
        bytes4[] allowedSelectors;
        bool isActive;
    }
    
    function grantSession(
        address agent,
        uint256 maxAmount,
        uint256 expiry,
        bytes4[] calldata allowedSelectors
    ) external;
    
    function revokeSession(address agent) external;
    function revokeAllSessions() external;
    function validateAndConsumeSession(
        address user,
        uint256 amount,
        bytes4 selector
    ) external returns (bool);
    function getSession(address user, address agent) external view returns (Session memory);
    function isSessionActive(address user, address agent) external view returns (bool);
    function getSessionRemaining(address user, address agent) external view returns (uint256);
}
