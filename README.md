# Rating DApp

## Requirements
### Tools
The application involves the usage of several tools which need to be previously installed: 
* [**Ganache**](https://www.trufflesuite.com/docs/ganache/overview) fires up a personal Ethereum blockchain which comes with 10 predefined accounts. It is used for deployment and testing purposes. Ganache can be downloaded directly from [here](https://www.trufflesuite.com/ganache).
* [**Metamask**](https://metamask.io/) is a browser extension which provides a secure way to connect to blockchain-based applications. Click [here](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en) to add Metamask to the browser.

After the tools are installed, you need to connect Metamask to Ganache. A complete setup up guide can be accessed [here](https://www.trufflesuite.com/docs/truffle/getting-started/truffle-with-metamask#setting-up-metamask).

Steps to import the accounts from Ganache into Metamask:
* Open Ganache.
* Copy the private key of the account you want to import.
* Open Metamask.
* Click on the top right icon.
* Choose the **Import account** option.
* Paste the private key of the account in the input field.
* Click on the **Import** button.

### Credentials
The application encapsulates an authentication module which needs valid credentials from Google, Github and Spotify. The credentials (Client ID and Client Secret) should be included in this [file](https://github.com/buterchiandreea/rating-dapp/blob/master/client/config/index.js). 

#### Steps to create an OAuth Client ID for Google
* Access [Google APIs](https://console.developers.google.com/apis/dashboard).
* From the top left menu choose **Credentials**.
* Choose the **Create Credentials** option and select **OAuth client ID** from the dropdown menu.
* From the **Application type** dropdown choose the **Web application** option.
* Complete the field **Authorized JavaScript origin** with `http://localhost:3000` and the field **Authorized redirect URIs** with `http://localhost:3000/auth/google/callback`.
* Click on the **Create** button.

Now the credentials (Client ID and Client Secret) should be visible on the webpage.

#### Steps to create an OAuth Client ID for Github
* Go to the Github [webpage](https://github.com/).
* Click on the top right icon and select **Settings** from the menu.
* Select **Developer settings**.
* Select **OAuth Apps**.
* Click on the **New OAuth App** button.
* Complete the field **Homepage URL** with `http://localhost:3000` and the field **Authorization callback URL** with `http://localhost:3000/auth/github/callback`.
* Click on the **Register Application** button.

Now the credentials (Client ID and Client Secret) should be visible on the webpage.

#### Steps to create an OAuth Client ID for Spotify
* Visit the Spotify [webpage](https://developer.spotify.com/dashboard/applications).
* Click on the **Create an App** button.
* Complete with a name and a description and click on the **Create** button.
* Click on the card corresponding with the new created application.
* Click on the **Edit Settings** button and complete the field **Website** with `http://localhost:3000` and the field **Redirect URIs** with `http://localhost:3000/auth/spotify/callback`.
* Click on the **Save** button.

Now the credentials (Client ID and Client Secret) should be visible on the webpage.

A complete guide can be accessed [here](https://developer.spotify.com/documentation/general/guides/app-settings/).

In order to create the OAuth credentials, you need to have an **active account** on Google, Github and Spotify.

### Dependencies
You need to install **Node.js** in order to start the application. Node.js can be downloaded from [here](https://nodejs.org/en/).

## Start the project

Make sure that Ganache and Metamask are opened. From the command line run the following commands:

* Go to the client directory and run the following commands: `npm install` and `npm install web3`.
* In the same directory run `truffle migrate --reset` to redeploy the smart contracts. 
* After the contracts are deployed, run `npm run dev` in order to start the application.
