// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/MindyVault.sol";
import "../src/MindyStrategyManager.sol";
import "../src/MindySessionKeyModule.sol";
import "../src/MindyYieldRouter.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy MindyVault (ERC4626 vault)
        address underlyingToken = vm.envAddress("UNDERLYING_TOKEN");
        MindyVault vault = new MindyVault(underlyingToken, deployerAddress);
        console.log("MindyVault deployed:", address(vault));

        // Deploy MindyStrategyManager
        MindyStrategyManager strategyManager = new MindyStrategyManager(deployerAddress);
        console.log("MindyStrategyManager deployed:", address(strategyManager));

        // Deploy MindySessionKeyModule
        MindySessionKeyModule sessionKeyModule = new MindySessionKeyModule();
        console.log("MindySessionKeyModule deployed:", address(sessionKeyModule));

        // Deploy MindyYieldRouter
        MindyYieldRouter yieldRouter = new MindyYieldRouter(deployerAddress);
        console.log("MindyYieldRouter deployed:", address(yieldRouter));

        // Configure vault with strategy manager
        vault.setStrategyManager(address(strategyManager));
        console.log("Vault configured with Strategy Manager");

        // Configure Strategy Manager with vault
        strategyManager.setVault(address(vault));
        console.log("Strategy Manager configured with Vault");

        vm.stopBroadcast();

        // Output deployment info
        console.log("");
        console.log("=== Deployment Summary ===");
        console.log("MindyVault:", address(vault));
        console.log("MindyStrategyManager:", address(strategyManager));
        console.log("MindySessionKeyModule:", address(sessionKeyModule));
        console.log("MindyYieldRouter:", address(yieldRouter));
    }
}
