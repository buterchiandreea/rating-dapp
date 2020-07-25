import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Component } from "react";
import Web3 from 'web3';
import Rating from '../contracts/Rating.json';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper'
import RateInput from "../components/RateInput";
import UpRateButton from "../components/UpRateButton";
import DownRateButton from "../components/DownRateButton";
import CryptoJS from 'crypto-js';
import { GOOGLE } from '../data/credentials';
import { Link } from 'react-router-dom';

class Rate extends Component {

  constructor(props) {
    super(props);
    this.state = {
        resource: '', 
        account: '', 
        ethBalance: '', 
        ratingContract: {}, 
        loading: true, 
        vote: false, 
        emptyResource: false, 
        ratedResources: [], 
        numberOfResources: 0, 
        inputValue: '', 
        rows: [], 
        refresh: true, 
        userData: {}
    };

    this.rate = this.rate.bind(this);
    this.handleUpVote = this.handleUpVote.bind(this);
    this.handleDownVote = this.handleDownVote.bind(this);
    this.checkResourceProvenience = this.checkResourceProvenience.bind(this);
    this.checkRatingProcess = this.checkRatingProcess.bind(this);
    this.fillTable = this.fillTable.bind(this);
    this.handleRatingCases = this.handleRatingCases.bind(this);
  }

  handleUpVote() {
    this.setState({ vote: true, resource: this.state.inputValue, inputValue: ''});
  }

  handleDownVote() {
    this.setState({ vote: false, resource: this.state.inputValue, inputValue: '' });
  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();

    fetch('/user')
        .then(res => res.json())
        .then(res => { 
          this.setState({ userData: res });
          let credentials = window.web3.utils.asciiToHex(CryptoJS.MD5(this.state.userData.id).toString());
          this.fillTable(credentials);
        })
        .catch(err => { 
            console.log(err);
        });
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    web3.currentProvider.enable();
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance: ethBalance });

    const networkID = await web3.eth.net.getId();
    const abi = Rating.abi;
    const ratingData = Rating.networks[networkID];
    if (ratingData) {
        const address = ratingData.address;
        const rating  = new web3.eth.Contract(abi, address);
        this.setState({ ratingContract: rating });

    } else {
        window.alert('The smart contract was not deployed to the detected network.');
    }

    this.setState({ loading: false });

    /**
     * Table initialization elements
     */
    const numberOfResources = this.state.ratingContract.methods.getNumberOfRatedResources().call();
    let resources = [];
    let i;
    for (i = 0; i < numberOfResources; i++) {
      let res = await this.state.ratingContract.methods.getRatedResource(i).call();
      resources.push(res.toString());
    }
    let rows = [];
    for (i = 0; i < resources.length; i++) {
      let credentials = window.web3.utils.asciiToHex(CryptoJS.MD5(this.state.userData.id).toString());
      const status = await this.state.ratingContract.methods.usersToResources(credentials, resources[i].toString()).call();
      if (status) {
        const votes = await this.state.ratingContract.methods.getResourceInformation(resources[i].toString()).call();
        rows.push(this.createData(resources[i], votes[0], votes[1]));
      }
    }
    this.setState({ rows });
  }

  async loadWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();   
    } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    } else {
        window.alert('Connect to Metamask.');
    }
  }

  rate(credentials, resource, vote) {
    this.setState({ loading: true });
    this.state.ratingContract.methods.rate(credentials, resource, vote).send({ from: this.state.account })
    .on('error', function (error) { window.alert(error.message); })
    .once('receipt', (receipt) => {
        this.setState({ loading: false });
    })
  }

  checkResourceProvenience(isResourceRated, resourceInformation, vote, credentials, resource, provider) {
    switch(provider) {
      case 'google':
        let googleTokens = resource.split('=');
        let googleURL = `https://www.googleapis.com/youtube/v3/videos?part=id&id=${googleTokens.pop()}&key=${GOOGLE.authorizationToken}`
        fetch(googleURL)
        .then(res => res.json())
        .then(res => {
          if (res.items.length === 0) {
            this.handleRatingCases(false, isResourceRated, resourceInformation, vote, credentials, resource);
          } else {
            this.handleRatingCases(true, isResourceRated, resourceInformation, vote, credentials, resource);
          }
        })
        .catch(err => { 
            console.log(err);
        });
        break;
      case 'github':
        let githubTokens = resource.split('/');
        let user = githubTokens[3];
        let repository = githubTokens[4];
        let githubURL = `https://api.github.com/repos/${user}/${repository}`
        fetch(githubURL)
        .then(res => res.json())
        .then(res => {
          if (res.name === repository) {
            this.handleRatingCases(true, isResourceRated, resourceInformation, vote, credentials, resource);
          } else {
            this.handleRatingCases(false, isResourceRated, resourceInformation, vote, credentials, resource);
          }
        })
        .catch(err => { 
            console.log(err);
        });
        break;
      default:
        let isSpotifyURL = /^(spotify:|https:\/\/[a-z]+\.spotify\.com\/)/.test(resource);
        this.handleRatingCases(isSpotifyURL, isResourceRated, resourceInformation, vote, credentials, resource);
    }
  }

  handleRatingCases(isResourceValid, isResourceRated, resourceInformation, vote, credentials, resource) {
    if (resource === '') {
      window.alert('Can not rate an empty resource.');
    } else if (isResourceValid === false) {
      window.alert('Invalid resource.');
    } else if (isResourceRated && (resourceInformation === vote)) {
      window.alert('Multiple ratings for the same resource are not allowed.');
    } else {
      this.rate(credentials, resource, vote);
    }
  }

  checkRatingProcess(credentials, resource, vote, provider) {
    const resourceInformation = this.state.ratingContract.methods.ratingsInformation(credentials, resource).call();
    const isResourceRated = this.state.ratingContract.methods.usersToResources(credentials, resource).call();

    Promise.all([resourceInformation, isResourceRated]).then(values => { 
      let resourceInformation = values[0];
      let isResourceRated = values[1];
      
      this.checkResourceProvenience(isResourceRated, resourceInformation, vote, credentials, resource, provider);
    });
  }

  fillTable(credentials) {
    let res = [];
    let pos = [];
    let rows = [];

    this.state.ratingContract.methods.getNumberOfRatedResources().call()
      .then((result) => {
        if (result !== null) {
          let promises = [];
          for (let i = 0; i < result; i++) {
            let promise = this.state.ratingContract.methods.getRatedResource(i).call();
            promises.push(promise);
          }

          Promise.all(promises).then(resources => { 
            for (let i = 0; i < resources.length; i++) {
              res.push(resources[i].toString());
            }

            let promises = [];
            for(let i = 0; i < resources.length; i++) {
              let promise = this.state.ratingContract.methods.usersToResources(credentials, resources[i]).call();
              promises.push(promise);
            }

            Promise.all(promises).then(values => { 
              for (let i = 0; i < values.length; i++) {
                if (values[i] === true) {
                  pos.push(i);
                }
              }
    
              let promises = [];
              for(let i = 0; i < pos.length; i++) {
                let promise = this.state.ratingContract.methods.getResourceInformation(res[pos[i]].toString()).call();
                promises.push(promise);
              }
              
              Promise.all(promises).then(values => { 
                for (let i = 0; i < values.length; i++) {
                  rows.push(this.createData(res[pos[i]], values[i][0], values[i][1]));
                }
                this.setState({ rows });
              });
            });
          });
        }
      });
  }

  createData(resource, likes, dislikes) {
    return { resource, likes, dislikes };
  }

  render() {
    const { vote } = this.state;
    const rightArrow = <React.Fragment>&#xbb;</React.Fragment>

    return (
        <div className={this.props.c.root}>

          <Grid container spacing={0} justify="center">
            <div className='header-wrapper' style={{ alignItems: 'center', textAlign: 'center' }}>
                <Typography style={{ fontSize: 50, fontWeight: 'bold', color: 'white', marginTop: -150 }}>
                  Let the Rating Adventure begin
                </Typography>
            </div>
            <Grid item xs={4}>
            </Grid>
            <Grid item xs={4} style={{ marginTop: -200, alignItems: 'center', textAlign: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <Link to={{
                              pathname: '/ratings',
                              state: {
                                rows: this.state.rows
                              }
                            }}
                      style={{ textDecoration: 'none', color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 50 }}
                    >
                      See ratings {rightArrow}
                </Link>
              </div>
              <Paper 
                className={this.props.c.paper}
              >
                <div className='login-form'>
                  <Typography style={{ fontSize: 32, color: 'white' }}>
                    Get a resource and rate it!
                  </Typography>
                </div>
                <form
                  onSubmit={(event) => {
                                  event.preventDefault();
                                  let resource = this.state.resource.toString();
                                  let credentials = window.web3.utils.asciiToHex(CryptoJS.MD5(this.state.userData.id).toString());
                                  this.checkRatingProcess(credentials, resource, vote, this.state.userData.provider);
                                  this.fillTable(credentials);
                  }} 
                  style={{ width: 'auto' }}
                >
                    <div style={{ marginTop: 85, alignItems: 'center' }}>
                      <RateInput
                          name="resource"
                          value={this.state.inputValue}
                          onChange={(e)=>{this.setState({inputValue: e.target.value.trim()})}}
                        >
                      </RateInput>
                    </div>
                     
                    <div style={{ marginTop: 60 }}>
                      <UpRateButton
                        type='submit'
                        onClick={this.handleUpVote}
                      >
                      </UpRateButton>
                      <DownRateButton
                        type='submit'
                        onClick={this.handleDownVote}
                      >
                      </DownRateButton>
                    </div>
                  </form>
              </Paper> 
            </Grid>
            <Grid item xs={4}>
            </Grid>
          </Grid>
        </div>
      );
  };
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    alignContent: 'strech', 
  }, 
  paper: {
    height: '400px', 
    marginTop: 40
  }
}));

 
const RateWrapper = () => {
    const classes = useStyles();
    return (
        <div>
          <Rate c={classes}/>
        </div>
    );
};
 
export default RateWrapper;
