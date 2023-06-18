// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts@4.8.3/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.8.3/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts@4.8.3/security/Pausable.sol";
import "@openzeppelin/contracts@4.8.3/access/Ownable.sol";
import "@openzeppelin/contracts@4.8.3/utils/Counters.sol";

contract ZKCred is ERC721, ERC721Enumerable, Pausable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    uint256 MAX_SUPPLY = 100;

    constructor() ERC721("ZKCred", "ZKC") {}

    function _baseURI() internal pure override returns (string memory) {
        return
            "https://ipfs.filebase.io/ipfs/QmbxahJofWFNEYRvJxB9P4vnNjqfDBaZoTmqB1cgZAei4r/";
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMint() public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        require(tokenId < MAX_SUPPLY, "Supply limit reached");
        _safeMint(msg.sender, tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        require(from == address(0), "Token not transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 id) public pure override returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "https://ipfs.filebase.io/ipfs/QmbxahJofWFNEYRvJxB9P4vnNjqfDBaZoTmqB1cgZAei4r/",
                    Strings.toString(id),
                    ".json"
                )
            );
    }

    function withdraw() public onlyOwner {
        require(address(this).balance > 0, "Balance is 0");
        payable(owner()).transfer(address(this).balance);
    }
}
