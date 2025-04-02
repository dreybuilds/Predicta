// SPDX-License-Identifier: MIT
pragma solidity 0.8.29;

contract PriceOracle {
    address public admin;
    uint64 public denominator = 1000000;
    event PriceUpdate(address indexed tokenId, uint64 indexed price);
    mapping(address => uint64) public prices; // 1 share -> price in usdc

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function updatePrice(address tokenId, uint64 price) public onlyAdmin {
        prices[tokenId] = price;
        emit PriceUpdate(tokenId, price);
    }

    function getPrice(address tokenId) public view returns (uint64) {
        return prices[tokenId];
    }
}