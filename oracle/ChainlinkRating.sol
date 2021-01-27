pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.4/ChainlinkClient.sol";
import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.4/vendor/Ownable.sol";

contract Rating is ChainlinkClient, Ownable {
    
    /* The default payment for a request */    
    uint256 constant private ORACLE_PAYMENT = 1 * LINK;
    address ORACLE_ID = 0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e;
    string JOB_ID = "29fa9aa13bf1468788b7cc4a500a45b8";
    bytes32 public resource;

    struct ratingItem {
       string credentials;
       string resourceID;
       bool vote;
    }
 
    struct resourceRating {
        uint256 likes;
        uint256 dislikes;
    }

    string[] public resources;
    mapping(string => resourceRating)  resourcesInformation;
    mapping(string => bool) ratedResources;
    mapping(string => mapping(string => bool)) ratingsInformation;
    mapping(string => mapping(string => bool)) usersToResources;
    ratingItem public ratedItem;
  
    /* Request templates */
    string private requestTemplateYoutube = "https://www.googleapis.com/youtube/v3/videos?part=id";
    
    /* Events */ 
    event RequestResource(bytes32 indexed requestId, bytes32 indexed resource);
    event LogNoMultipleVotesAllowed(string errorMessage);
    event LogSuccessfullyRatedItem(string message);
    
    constructor() public Ownable() {
        setPublicChainlinkToken();
    }

    function rateItem(string memory _credentials, string memory _resource, bool vote)
    public
    onlyOwner
    {
        Chainlink.Request memory request = buildChainlinkRequest(stringToBytes32(JOB_ID), this, this.fulfillRequest.selector);
        request.add("get", concat(requestTemplateYoutube, "&id=", _resource, "&key=", _credentials));
        request.add("path", "items.0.id");
        ratedItem = ratingItem(_credentials, _resource, vote);
        sendChainlinkRequestTo(ORACLE_ID, request, ORACLE_PAYMENT);
    
    }
    
    function handleRateOperation(
        string memory _cred,
        string memory _res,
        bool _vote
    ) public {
        if (usersToResources[_cred][_res] == true) {
            if (
                ratingsInformation[_cred][_res] == true &&
                _vote == false
            ) {
                ratingsInformation[_cred][_res] = false;
                resourcesInformation[_res].likes -= 1;
                resourcesInformation[_res].dislikes += 1;
            }
            if (
                ratingsInformation[_cred][_res] == false &&
                _vote == true
            ) {
                ratingsInformation[_cred][_res] = true;
                resourcesInformation[_res].likes += 1;
                resourcesInformation[_res].dislikes -= 1;
            }
        } else {
            if (ratedResources[_res] == false) {
                ratedResources[_res] = true;
                resources.push(_res);
                usersToResources[_cred][_res] = true;
                if (_vote == true) {
                    resourcesInformation[_res] = resourceRating(1, 0);
                    ratingsInformation[_cred][_res] = true;
                } else {
                    resourcesInformation[_res] = resourceRating(0, 1);
                    ratingsInformation[_cred][_res] = false;
                }
            } else {
                usersToResources[_cred][_res] = true;
                if (_vote == true) {
                    resourcesInformation[_res].likes += 1;
                } else {
                    resourcesInformation[_res].dislikes += 1;
                }
            }
        }
    }
    
    function getResourceInformation(string memory _resourceID)
        public
        view
        returns (uint256, uint256)
    {
        return (
            resourcesInformation[_resourceID].likes,
            resourcesInformation[_resourceID].dislikes
        );
    }

    function getNumberOfRatedResources() public view returns (uint256) {
        return resources.length;
    }

    function getRatedResource(uint256 _index)
        public
        view
        returns (string memory)
    {
        return resources[_index];
    }
    
    function fulfillRequest(bytes32 _requestId, bytes32 _response)
        public
        recordChainlinkFulfillment(_requestId)
    {
        emit RequestResource(_requestId, _response);
        resource = _response;
        if (resource == stringToBytes32(ratedItem.resourceID)) {
            handleRateOperation(ratedItem.credentials, ratedItem.resourceID, ratedItem.vote);
        }
    }
    
    function stringToBytes32(string memory source) 
        private 
        pure
        returns(bytes32 result)
    {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
          return 0x0;
        }
        assembly {
          result := mload(add(source, 32))
        }
    }
    
    function bytes32ToStr(bytes32 _bytes32)
        public
        pure
        returns (string) 
    {
        bytes memory bytesArray = new bytes(32);
        for (uint256 i; i < 32; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }
    
    function concat(string memory _s1, string memory _s2, string memory _s3, string memory _s4, string memory _s5) 
        private
        pure
        returns(string memory) 
    {
        return string(abi.encodePacked(_s1, _s2, _s3, _s4, _s5));
    }
    
}