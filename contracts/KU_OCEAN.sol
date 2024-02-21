// SPDX-License-Identifier:MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "./lib/Auth.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract KU_OCEAN is ERC721, ERC721Burnable, Auth {

    using Strings for uint256;
    uint256 public _tokenIdNum = 0;
    //Set mint limit
    uint256 public constant MAX_SUPPLY = 6000;
    //0.01eth per mint
    uint256 public price = 0.1 ether;

    string public _baseURIextended= "ipfs::/ipfs_link/";

    event SetPrice(uint256 _value);

    constructor() ERC721("KU_OCEAN", "KU") Auth(_msgSender()) {
    }


    function setBaseURI(string memory baseURI_) external authorized {
        _baseURIextended = baseURI_;
    }


    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);

        string memory baseURI = _baseURIextended;
        return bytes(baseURI).length > 0 ? string.concat(baseURI, tokenId.toString()) : "";
    }

    function setPrice(uint256 _price) external authorized {
        price = _price;
        emit SetPrice(_price);
    }

    function mint(uint numberOfTokens) public payable authorized { // only owner can mint to our KU Ocean
        uint256 tokenId = _tokenIdNum;
        require(tokenId + numberOfTokens <= MAX_SUPPLY, "Mint limited");
        
        // require(price * numberOfTokens <= msg.value, "Ether value sent is not correct");

        for (uint256 i = 0; i < numberOfTokens; i++) {
            _safeMint(_msgSender(), _tokenIdNum);
            _tokenIdNum += 1;
        }
    }

    
    function withdraw() public authorized {
        uint balance = address(this).balance;
        (bool os, ) = payable(_msgSender()).call{value: balance}("");
        require(os);
    }
    // This function iss are override required by solidity
    // function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
    //     return super.supportsInterface(interfaceId);
    // }
}