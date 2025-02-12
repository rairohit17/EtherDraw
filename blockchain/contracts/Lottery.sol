// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import {AutomationCompatible} from  "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

// ERROR 
error Lottery__TransactionFailed();
error Lottery_EntryFeesNotSufficient();
error Lottery__UpkeepNotNeeded(bool status, uint256 length,uint256 balance , uint256 timePassed);
error Lottery_LotteryIsClosed ();

//CONTRACT
contract Lottery is VRFConsumerBaseV2Plus , AutomationCompatible {

    // enumeratons
    enum LotteryStatus{OPEN,CALCULATING} //  0 for open and 1 for closed 


     // state variables
    uint256 private immutable i_minEntryFees;
    bytes32 private immutable i_keyHash;
    uint32 public callbackGasLimit = 100000;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;
    uint256 private immutable i_subscriptionId;
    uint256  public s_lastRequestId;
    address private s_recentWinner;
    address payable[] private s_participants;
    LotteryStatus private s_lotteryStatus;
    uint256 public s_previousTime ;
    uint256  private immutable i_interval;
    




 // EVENTS
    event RequestIdForRandomWords(uint256 randomId);
    event WinnerPicked( address recentWinner);
    event ParticipantAdded( address sender);

   constructor(
        uint256 subscriptionId,
        address vrfCoordinator,
        bytes32 keyHash,
        uint256 minimumFees,
        uint256 interval
        
       
        
    )
        VRFConsumerBaseV2Plus(vrfCoordinator)
    {
        i_subscriptionId = subscriptionId;
        i_keyHash = keyHash;
        i_minEntryFees= minimumFees;
        i_interval= interval;
        s_lotteryStatus= LotteryStatus.OPEN;
        s_previousTime= block.timestamp;
       
    }
    
     function participateInLottery() payable public returns (address participantAddress){
        if (msg.value< i_minEntryFees) revert Lottery_EntryFeesNotSufficient();
        if ( s_lotteryStatus != LotteryStatus.OPEN) revert Lottery_LotteryIsClosed();
        s_participants.push(payable(msg.sender));
        emit ParticipantAdded(msg.sender);
        return msg.sender;

    }

       function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        view
        override
        returns (bool upkeepNeeded, bytes memory /* performData */)
    {
        bool isActive = (s_lotteryStatus== LotteryStatus.OPEN);
        bool participantsExist = s_participants.length>0;
        bool fundExists = address(this).balance>0;
        bool timeExhausted =(s_previousTime + i_interval)< block.timestamp ;
        upkeepNeeded = (isActive && participantsExist && fundExists && timeExhausted);
    }

    /**
     * @dev the chainlink keeper nodes monitor the checkUpKepp function when the function returns 
     * true this function gets executed  the condition specified are met 
     * for this case the conditons are the election must be active , participants must exist 
     * the funds must exist and the time must be exhausted for the lottery
     */

      function performUpkeep(bytes calldata /*performData*/)  override external{
         
        ( bool status , ) = checkUpkeep("");
        if (!status ){
            revert Lottery__UpkeepNotNeeded(s_lotteryStatus == LotteryStatus.OPEN, s_participants.length, address(this).balance, (s_previousTime+ i_interval));
        }
                bytes memory extraArgs = abi.encode(
                VRFV2PlusClient.ExtraArgsV1({
                 nativePayment: false  // or false
                    })
                    );

                // Prefix with the tag
                bytes memory fullExtraArgs = abi.encodePacked(
                 VRFV2PlusClient.EXTRA_ARGS_V1_TAG, 
                    extraArgs
                );

            s_lotteryStatus = LotteryStatus.CALCULATING;
            uint256 requestId = s_vrfCoordinator.requestRandomWords(VRFV2PlusClient.RandomWordsRequest({
            keyHash:i_keyHash,
            subId:i_subscriptionId,
            requestConfirmations:REQUEST_CONFIRMATIONS,
            callbackGasLimit:callbackGasLimit,
            numWords:NUM_WORDS,
            extraArgs:fullExtraArgs
            })
      );
        s_lastRequestId= requestId;
        emit  RequestIdForRandomWords(requestId);


    }

    function fulfillRandomWords( uint256 , uint256[] calldata randomWords) internal override  {
        uint256 indexOfWinner= randomWords[0]%s_participants.length;
        address payable recentWinner = s_participants[indexOfWinner];
        (bool success ,  ) = recentWinner.call{value:address(this).balance}("");
        if ( !success) revert Lottery__TransactionFailed();
        s_recentWinner= recentWinner;
        s_lotteryStatus = LotteryStatus.OPEN;
        s_participants = new address payable[](0);
        s_previousTime = block.timestamp;
        emit WinnerPicked(recentWinner);

    }

  

   
    // VIEW functions 

    function getParticipant ( uint256 index) public view returns (address){
        return s_participants[index];
    }

    function getMinimumEntryFees ( ) public view  returns (uint256 amount){
        return i_minEntryFees;
    }

    function getRecentWinner ( ) public view returns ( address winner){
        return s_recentWinner;
    }

    function getLotteryState( ) public view returns ( LotteryStatus){
        return s_lotteryStatus;
    }
    function getNUmberOfParticipants() public view returns (uint256){
        return s_participants.length;
    }

    function getInterval() public view returns ( uint256){
        return i_interval;
    }
     function getTimeStamp() public view returns (uint256){
        return block.timestamp;
     }

    //Pure functions 
    function getLotteryNumber() public pure  returns ( uint32 ){
        return  NUM_WORDS;
    }// this function is pure as we are just reading a constant value 
    // but this is not the case with immutable as they are stored in cintracts storage 
    
    function getConfirmationsNumber() public pure returns (uint256){
        return REQUEST_CONFIRMATIONS;
    }
    
  }







