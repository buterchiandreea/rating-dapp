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
The application encapsulates an authentication module which needs valid credentials from Google, Github and Spotify. The credentials should be included in this [file](https://github.com/buterchiandreea/rating-dapp/blob/master/client/config/index.js). 

#### Steps to create an OAuth Client ID for Google
* Access [Google APIs](https://console.developers.google.com/apis/dashboard).
* From the top left menu choose **Credentials**.
* Choose the **Create Credentials** option and select **OAuth client ID** from the dropdown menu.
* From the **Application type** dropdown choose the **Web application** option.
* Complete the field **Authorized JavaScript origin** with `http://localhost:3000` and the field **Authorized redirect URIs** with `http://localhost:3000/auth/google/callback`.
* Click on the **Create** button.

### Dependencies
You need to install **Node.js** in order to start the application. Node.js can be downloaded from [here](https://nodejs.org/en/).

## Start the project

* Go to the client directory and run the following commands: `npm install` and `npm install web3`.
* In the same directory run `truffle migrate --reset` to redeploy the smart contracts. 
* After the contracts are deployed, run `npm run dev` in order to start the application.
