// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract RevenueToken is ERC1155, ReentrancyGuard {

    struct RevenueItem {
        address creator;
        uint256 creatorPortion; // in percentage (e.g., 10 for 10%)
        uint256 pricePerToken; // in wei (1 finney = 0.001 ether)
        uint256 targetInvestment; // in wei (target investment in ether)
        uint256 totalSupply; // current total supply
        uint256 totalTokens; // total tokens to be minted
    }

    mapping(uint256 => RevenueItem) public revenueItems;
    mapping(uint256 => uint256) private _totalSupply;
    mapping(uint256 => mapping(address => uint256)) public pendingWithdrawals;
    mapping(uint256 => address[]) private _holders;

    // Stores minting revenue for each creator
    mapping(address => uint256) private _mintingRevenue;

    constructor() ERC1155("lingkoop-revenue") {}
function createRevenueItem(
    uint256 id,
    address creator,
    uint256 creatorPortion,
    uint256 totalTokens,
    uint256 targetInvestment
) public {
    require(creatorPortion <= 100, "Creator portion must be <= 100%");
    require(totalTokens > 0, "Total tokens must be greater than 0");
    require(targetInvestment >= totalTokens, "Target investment must be >= total tokens");

    // Check that the RevenueItem ID has not been used before
    require(revenueItems[id].targetInvestment == 0, "Revenue item with this ID already exists");

    uint256 pricePerToken = targetInvestment / totalTokens;

    revenueItems[id] = RevenueItem({
        creator: creator,
        creatorPortion: creatorPortion,
        pricePerToken: pricePerToken,
        targetInvestment: targetInvestment,
        totalSupply: 0,
        totalTokens: totalTokens
    });
}


    function mintRevenueToken(uint256 id, uint256 amount) public payable {
        RevenueItem storage item = revenueItems[id];
        require(item.targetInvestment > 0, "Revenue item does not exist");
        require(item.totalSupply + amount <= item.totalTokens, "Exceeds maximum supply");
        require(msg.value == item.pricePerToken * amount, "Incorrect ETH sent");

        _mint(msg.sender, id, amount, "");
        _totalSupply[id] += amount;
        item.totalSupply += amount;

        if (balanceOf(msg.sender, id) == amount) {
            _holders[id].push(msg.sender);
        }

        // Store minting revenue for the creator
        _mintingRevenue[item.creator] += msg.value;
    }

    function distributeRevenue(uint256 revenueTokenId) external payable nonReentrant {
        RevenueItem storage item = revenueItems[revenueTokenId];
        uint256 tokenSupply = _totalSupply[revenueTokenId];
        require(tokenSupply > 0, "No revenue tokens minted for this ID");

        uint256 creatorRevenue = (msg.value * item.creatorPortion) / 100;
        pendingWithdrawals[revenueTokenId][item.creator] += creatorRevenue;

        uint256 remainingRevenue = msg.value - creatorRevenue;
        uint256 revenuePerToken = remainingRevenue / tokenSupply;

        for (uint256 i = 0; i < _holders[revenueTokenId].length; i++) {
            address holder = _holders[revenueTokenId][i];
            uint256 balance = balanceOf(holder, revenueTokenId);
            uint256 revenue = balance * revenuePerToken;
            pendingWithdrawals[revenueTokenId][holder] += revenue;
        }
    }

    // Creator withdraws their minting revenue
    function withdrawMintingRevenue() external nonReentrant {
        uint256 amount = _mintingRevenue[msg.sender];
        require(amount > 0, "No minting revenue to withdraw");

        _mintingRevenue[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    // Withdraw revenue for both token holders and creators from distribution
    function withdrawRoyalty(uint256 revenueTokenId) external nonReentrant {
        uint256 amount = pendingWithdrawals[revenueTokenId][msg.sender];
        require(amount > 0, "No royalty revenue to withdraw");

        pendingWithdrawals[revenueTokenId][msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    function totalSupply(uint256 id) public view returns (uint256) {
        return _totalSupply[id];
    }
}
