// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IMindyVault
 * @notice Interface for MindyVault contract
 */
interface IMindyVault {
    function availableFunds() external view returns (uint256);
    function allocateToStrategy(uint256 amount) external;
    function returnFromStrategy(uint256 amount) external;
    function totalAssets() external view returns (uint256);
    function asset() external view returns (address);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}
