// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./RevenueToken.sol"; // Import the distribution contract

contract lingkoop is ERC1155, Ownable, ReentrancyGuard {

    struct Item {
        uint256 id;
        uint256 price;
        address payable recipient;
    }

    mapping(uint256 => Item) public items;
    mapping(uint256 => string) private tokenURIs;
    address public distributionContract; // Distribution contract address

    event ItemCreated(uint256 id, uint256 price, address recipient, string metadataUri);
    event ItemPurchased(address indexed buyer, uint256 id, uint256 amount);

    // Call the constructor from ERC1155 with URI and Ownable with the initial owner address
    constructor() ERC1155("lingkoop-item") Ownable(msg.sender) {}

    function setDistributionContract(address _distributionContract) external onlyOwner {
        require(_distributionContract != address(0), "Invalid distribution contract address");
        distributionContract = _distributionContract;
    }

    function createItem(uint256 id, uint256 price, address payable recipient, string memory metadataUri) public onlyOwner {
        require(recipient != address(0), "Invalid recipient address");
        require(price > 0, "Price must be greater than zero");
        require(items[id].id == 0, "Item ID already exists");

        items[id] = Item({
            id: id,
            price: price,
            recipient: recipient
        });

        tokenURIs[id] = metadataUri;

        emit ItemCreated(id, price, recipient, metadataUri);
    }

    function purchaseItem(uint256 id, uint256 amount) public payable nonReentrant {
        require(items[id].price > 0, "Item does not exist");
        require(msg.value == items[id].price * amount, "Incorrect Ether value sent");

        address payable recipient = items[id].recipient;

        if (recipient == distributionContract) {
            // If the recipient is a valid distribution contract, call the distribution function
            RevenueToken(recipient).distributeRevenue{value: msg.value}(id);
        } else {
            // Transfer Ether to the recipient
            recipient.transfer(msg.value);
        }

        _mint(msg.sender, id, amount, "");

        emit ItemPurchased(msg.sender, id, amount);
    }

    function uri(uint256 id) public view override returns (string memory) {
        return tokenURIs[id];
    }

    function setURI(uint256 id, string memory newuri) public onlyOwner {
        require(items[id].id > 0, "Item does not exist");
        tokenURIs[id] = newuri;
    }

    function isContract(address addr) internal view returns (bool) {
        return addr.code.length > 0;
    }
}
