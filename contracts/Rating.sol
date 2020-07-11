pragma solidity 0.5.16;

contract Rating {
    struct resourceRating {
        uint256 likes;
        uint256 dislikes;
    }

    string[] public resources;
    mapping(string => resourceRating) public resourcesInformation;
    mapping(string => bool) public ratedResources;
    mapping(bytes32 => mapping(string => bool)) public ratingsInformation;
    mapping(bytes32 => mapping(string => bool)) public usersToResources;

    event LogSuccessfullyRatedItem(string message);
    event LogNoMultipleVotesAllowed(string errorMessage);

    function rate(
        bytes32 _credentials,
        string memory _resourceID,
        bool _vote
    ) public {
        if (usersToResources[_credentials][_resourceID] == true) {
            if (
                ratingsInformation[_credentials][_resourceID] == true &&
                _vote == false
            ) {
                ratingsInformation[_credentials][_resourceID] = false;
                resourcesInformation[_resourceID].likes -= 1;
                resourcesInformation[_resourceID].dislikes += 1;
            }
            if (
                ratingsInformation[_credentials][_resourceID] == false &&
                _vote == true
            ) {
                ratingsInformation[_credentials][_resourceID] = true;
                resourcesInformation[_resourceID].likes += 1;
                resourcesInformation[_resourceID].dislikes -= 1;
            }
        } else {
            if (ratedResources[_resourceID] == false) {
                ratedResources[_resourceID] = true;
                resources.push(_resourceID);
                usersToResources[_credentials][_resourceID] = true;
                if (_vote == true) {
                    resourcesInformation[_resourceID] = resourceRating(1, 0);
                    ratingsInformation[_credentials][_resourceID] = true;
                    emit LogSuccessfullyRatedItem(
                        "Resource was successfully rated."
                    );
                } else {
                    resourcesInformation[_resourceID] = resourceRating(0, 1);
                    ratingsInformation[_credentials][_resourceID] = false;
                    emit LogSuccessfullyRatedItem(
                        "Resource was successfully rated."
                    );
                }
            } else {
                usersToResources[_credentials][_resourceID] = true;
                if (_vote == true) {
                    resourcesInformation[_resourceID].likes += 1;
                    emit LogSuccessfullyRatedItem(
                        "Resource was successfully rated."
                    );
                } else {
                    resourcesInformation[_resourceID].dislikes += 1;
                    emit LogSuccessfullyRatedItem(
                        "Resource was successfully rated."
                    );
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
