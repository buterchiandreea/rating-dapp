pragma solidity ^0.5.12;
import "github.com/provable-things/ethereum-api/provableAPI_0.5.sol";

contract Rating is usingProvable {

    struct resourceRating {
        uint256 likes;
        uint256 dislikes;
    }

    string[] public resources;
    mapping(string => resourceRating) public resourcesInformation;
    mapping(string => bool) public ratedResources;
    mapping(string => mapping(string => bool)) public ratingsInformation;
    mapping(string => mapping(string => bool)) public usersToResources;
   
   /* The response provided by the execution of the Provable Query */
   string public resourceID;
   string private provableRequestURL;
   string private requestTemplateYouTube = "https://www.googleapis.com/youtube/v3/videos?part=id";
   
   /* Provable */
   mapping(bytes32 => bool) private validIds;
   mapping(bytes32 => string) private queryIDToVoter;
   mapping(bytes32 => bool) private queryIDToVote;
   
   /* Events */
   event LogConstructorInitiated(string nextStep);
   event LogNewProvableQuery(string description);
   event LogInvalidQueryID(string message);
   event LogUnauthorizedCaller(string message);
   event LogIncorrectCredentials(string errorMessage);

   constructor () public payable {
       emit LogConstructorInitiated("Constructor was initiated... Call 'rate()' to send the Provable Query.");
   }

   function __callback(bytes32 _queryID, string memory _result) public {
       if (!validIds[_queryID]) {
           emit LogInvalidQueryID('Invalid Provable Query ID.');
           revert();
       } 
       if (msg.sender != provable_cbAddress()) {
           emit LogUnauthorizedCaller('The sender of the current request is unauthorized.');
           revert();
       }
       /* If the API response is valid, then it will return the resourse's ID the user up/down voted */
       resourceID = _result;
       
       if (strCompare(resourceID, '') == 0) {
           emit LogIncorrectCredentials('Please provide valid credentials / valid resource IDs in order to rate successfully.');
           revert('Invalid credentials or resource ID...');
       }
       
       handleRateOperation(queryIDToVoter[_queryID], resourceID, queryIDToVote[_queryID]);

       delete validIds[_queryID];
       delete queryIDToVoter[_queryID];
       delete queryIDToVote[_queryID];
   }

    function rate(string memory _credentials, string memory _resource, bool _vote) public payable {
       if (provable_getPrice("URL") > address(this).balance) {
           emit LogNewProvableQuery("Provable query was NOT sent, please add some ETH to cover for the query fee... ");
       } else {
           emit LogNewProvableQuery("Provable query was sent, standing by for the answer... ");
           string memory requestURL = strConcat(requestTemplateYouTube, "&id=", _resource, "&key=", _credentials);
           provableRequestURL = strConcat("json(", requestURL, ").items[0].id");
           bytes32 queryID = provable_query("URL", provableRequestURL);
           validIds[queryID] = true;
           queryIDToVoter[queryID] = _credentials;
           queryIDToVote[queryID] = _vote;
       }
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

}
