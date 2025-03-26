// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {MyToken} from "./MyToken.sol";

/**
 * Destination Chain: WrappedMyToken
 * @title  WrappedMyToken is MyToken
 * @author zsp
 * @notice
 */
contract WrappedMyToken is MyToken {
    constructor(
        string memory name,
        string memory symbol
    ) MyToken(name, symbol) {}

    function mintTokenWithSpecificTokenId(address to, uint256 tokenId) public {
        _safeMint(to, tokenId);
    }
}
