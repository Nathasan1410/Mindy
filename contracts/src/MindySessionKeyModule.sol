// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title MindySessionKeyModule
 * @notice Scoped session key authorization for AI auto-signing
 * @dev Users grant time-limited, function-scoped permissions to AI agent
 */
contract MindySessionKeyModule is ReentrancyGuard {
    using ECDSA for bytes32;
    
    // Session struct representing delegated authority
    struct Session {
        address agent;           // AI agent address
        uint256 maxAmount;       // Maximum amount agent can spend
        uint256 spent;           // Amount already spent
        uint256 expiry;          // Session expiration timestamp
        bytes4[] allowedSelectors; // Allowed function selectors
        bool isActive;
    }
    
    // State
    mapping(address => mapping(address => Session)) public sessions; // user => agent => session
    mapping(address => address[]) public userAgents; // user => list of agents
    
    // Events
    event SessionGranted(
        address indexed user,
        address indexed agent,
        uint256 maxAmount,
        uint256 expiry,
        bytes4[] allowedSelectors
    );
    event SessionRevoked(address indexed user, address indexed agent);
    event SessionUsed(
        address indexed user,
        address indexed agent,
        uint256 amount,
        bytes4 selector
    );
    event SessionExpired(address indexed user, address indexed agent);
    
    /**
     * @notice Grant a scoped session to an AI agent
     * @param agent AI agent address to authorize
     * @param maxAmount Maximum amount (in vault shares) agent can manage
     * @param expiry Unix timestamp when session expires
     * @param allowedSelectors Array of function selectors agent can call
     */
    function grantSession(
        address agent,
        uint256 maxAmount,
        uint256 expiry,
        bytes4[] calldata allowedSelectors
    ) external nonReentrant {
        require(agent != address(0), "MindySession: zero address");
        require(expiry > block.timestamp, "MindySession: invalid expiry");
        require(allowedSelectors.length > 0, "MindySession: no selectors");
        require(maxAmount > 0, "MindySession: zero max amount");
        
        // Create or update session
        Session storage session = sessions[msg.sender][agent];
        
        // If new session, add to user's agent list
        if (!session.isActive) {
            userAgents[msg.sender].push(agent);
        }
        
        session.agent = agent;
        session.maxAmount = maxAmount;
        session.spent = 0;
        session.expiry = expiry;
        session.allowedSelectors = allowedSelectors;
        session.isActive = true;
        
        emit SessionGranted(msg.sender, agent, maxAmount, expiry, allowedSelectors);
    }
    
    /**
     * @notice Revoke a session immediately
     * @param agent AI agent address to revoke
     */
    function revokeSession(address agent) external {
        require(sessions[msg.sender][agent].isActive, "MindySession: no active session");
        
        sessions[msg.sender][agent].isActive = false;
        
        emit SessionRevoked(msg.sender, agent);
    }
    
    /**
     * @notice Revoke all sessions for a user
     */
    function revokeAllSessions() external {
        address[] storage agents = userAgents[msg.sender];
        for (uint256 i = 0; i < agents.length; i++) {
            if (sessions[msg.sender][agents[i]].isActive) {
                sessions[msg.sender][agents[i]].isActive = false;
                emit SessionRevoked(msg.sender, agents[i]);
            }
        }
    }
    
    /**
     * @notice Validate and consume a session for a transaction
     * @dev Called by AI agent before executing a rebalance
     * @param user User who granted the session
     * @param amount Amount being spent in this transaction
     * @param selector Function selector being called
     * @return bool True if session is valid
     */
    function validateAndConsumeSession(
        address user,
        uint256 amount,
        bytes4 selector
    ) external returns (bool) {
        Session storage session = sessions[user][msg.sender];
        
        require(session.isActive, "MindySession: session inactive");
        require(block.timestamp < session.expiry, "MindySession: session expired");
        require(isSelectorAllowed(session, selector), "MindySession: selector not allowed");
        require(session.spent + amount <= session.maxAmount, "MindySession: exceeds max");
        
        // Consume from session limit
        session.spent += amount;
        
        emit SessionUsed(user, msg.sender, amount, selector);
        
        return true;
    }
    
    /**
     * @notice Check if a function selector is allowed in this session
     * @param session Session to check
     * @param selector Function selector to validate
     * @return bool True if allowed
     */
    function isSelectorAllowed(Session storage session, bytes4 selector) 
        internal 
        view 
        returns (bool) 
    {
        for (uint256 i = 0; i < session.allowedSelectors.length; i++) {
            if (session.allowedSelectors[i] == selector) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * @notice Get session details
     * @param user User address
     * @param agent Agent address
     * @return Session struct
     */
    function getSession(address user, address agent) 
        external 
        view 
        returns (Session memory) 
    {
        return sessions[user][agent];
    }
    
    /**
     * @notice Check if a session is active and valid
     * @param user User address
     * @param agent Agent address
     * @return bool True if session is active and not expired
     */
    function isSessionActive(address user, address agent) external view returns (bool) {
        Session storage session = sessions[user][agent];
        return session.isActive && block.timestamp < session.expiry;
    }
    
    /**
     * @notice Get all agents a user has granted sessions to
     * @param user User address
     * @return Array of agent addresses
     */
    function getUserAgents(address user) external view returns (address[] memory) {
        return userAgents[user];
    }
    
    /**
     * @notice Get remaining amount in a session
     * @param user User address
     * @param agent Agent address
     * @return Remaining amount
     */
    function getSessionRemaining(address user, address agent) 
        external 
        view 
        returns (uint256) 
    {
        Session storage session = sessions[user][agent];
        if (!session.isActive || block.timestamp >= session.expiry) {
            return 0;
        }
        return session.maxAmount - session.spent;
    }
}
