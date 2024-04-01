// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";

// Import ERC20
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


contract NURA is ERC20, ERC20Burnable {


    address Owner;

    constructor() ERC20("NURA", "NURA-BNB") {
        Owner = _msgSender();
    }

    modifier onlyBridge() {
        require(
            Owner == msg.sender,
            "NURA: only the bridge can trigger this method!"
        );
        _;
    }

    // @dev called from the bridge when tokens are locked on ETH side
    function mint(address _recipient, uint256 _amount)
        public
        virtual
        onlyBridge
    {
        _mint(_recipient, _amount);
        console.log("Tokens minted for %s", _recipient);
    }

    // @dev called from the bridge when tokens are received on Harmony side
    function burnFrom(address _account, uint256 _amount)
        public
        virtual
        override(ERC20Burnable)
        onlyBridge
    {
        super.burnFrom(_account, _amount);
        console.log("Tokens burned from %s", _account);
    }


    function getOwner() public view returns (address) {
        return Owner;
    }

    function transferOwnership(address newOwner) public onlyBridge {
        require(newOwner != address(0), "Invalid new owner address");
        emit OwnershipTransferred(Owner, newOwner);
        Owner = newOwner;
    }
}
