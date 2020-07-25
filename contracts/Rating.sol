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

    function rate(
        bytes32 _cred,
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
