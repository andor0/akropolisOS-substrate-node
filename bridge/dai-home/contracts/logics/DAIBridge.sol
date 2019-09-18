pragma solidity ^0.5.9;

import 'openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol';

//Beneficieries (validators) template
import "../helpers/BeneficiaryOperations.sol";

contract DAIBridge is  BeneficiaryOperations {

        IERC20 private token;



        event RelayMessage(bytes32 messageID, address indexed sender, string indexed recipient);

       /**
       * @notice Constructor.
       * @param _token  Address of DAI token
       */
    
        constructor (IERC20 _token) public
            BeneficiaryOperations() {
            token = _token;
        }  

        // MODIFIERS
        /**
        * @dev Allows to perform method by existing beneficiary
        */
        modifier onlyExistingBeneficiary(address _beneficiary) {
            require(isExistBeneficiary(_beneficiary), "address is not in beneficiary array");
             _;
        }

        function setTransfer(uint amount, string memory substrateAddress) public {
            require(token.allowance(msg.sender, address(this)) >= amount, "contract is not allowed to this amount");
            token.transferFrom(msg.sender, address(this), amount);

            bytes32 messageID = keccak256(abi.encodePacked(now));

            emit RelayMessage(messageID, msg.sender, substrateAddress);
        }



}