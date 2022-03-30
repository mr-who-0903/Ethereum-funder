// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Funder{
    uint public numOfFunders;

    mapping(uint=>address) private funders;

    receive() external payable{}

    function transfer() external payable {     // external = function will be called ONLY externally
        funders[numOfFunders] = msg.sender;
        numOfFunders++;
    }

    function withdraw(uint withdrawAmount) external{
        require(withdrawAmount <= 2000000000000000000, "Cannot withdraw more than 2 ETH");
        payable(msg.sender).transfer(withdrawAmount);
    }
}
    