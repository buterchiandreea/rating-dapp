import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useContext } from "react";
import UserProvider from "../contexts/UserProvider";
import { Component } from "react";
import Web3 from 'web3';
import Rating from '../contracts/Rating.json';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper'
import RateInput from "../components/RateInput";
import UpRateButton from "../components/UpRateButton";
import DownRateButton from "../components/DownRateButton";


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
        provider: '', 
        id: '', 
        inputValue: '', 
        rows: [], 
        refresh: true
    };

    this.rateItem = this.rateItem.bind(this);
    this.handleUpVote = this.handleUpVote.bind(this);
    this.handleDownVote = this.handleDownVote.bind(this);
    this.getItemInformation = this.getItemInformation.bind(this);
    this.getRatingStatus = this.getRatingStatus.bind(this);
    this.handleUserIDChange = this.handleUserIDChange.bind(this);
    this.handleUserProviderChange = this.handleUserProviderChange.bind(this);
    this.checkURL = this.checkURL.bind(this);
    this.checkRatingProcess = this.checkRatingProcess.bind(this);
    this.fillTable = this.fillTable.bind(this);
    this.handleRefreshTable = this.handleRefreshTable(this);
  }

  handleChange = (event) => {
    const { target: { name, value } } = event;
    this.setState({ inputValue: value});
  }

  handleUpVote() {
    this.setState({ vote: true, resource: this.state.inputValue, inputValue: ''});
  }

  handleDownVote() {
    this.setState({ vote: false, resource: this.state.inputValue, inputValue: '' });
  }

  handleRefreshTable() {
    this.setState({ refresh: true});
  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  handleUserIDChange(updatedID) {
    this.setState({ id: updatedID });
  }

  handleUserProviderChange(updatedProvider) {
    this.setState({ provider: updatedProvider });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.userData.id !== this.props.userData.id) {
      this.handleUserIDChange(this.props.userData.id);
    }
    if (prevProps.userData.provider !== this.props.userData.provider) {
      this.handleUserProviderChange(this.props.userData.provider);
    }
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
        window.alert('Contract is not deployed to the detected network.');
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
      resources.push(window.web3.toAscii(res));
    }
    let rows = [];
    for (i = 0; i < resources.length; i++) {
      const status = await this.state.ratingContract.methods.usersToResources(window.web3.fromAscii(this.state.id), window.web3.fromAscii(resources[i])).call();
      if (status) {
        const votes = await this.state.ratingContract.methods.getResourceInformation(window.web3.fromAscii(resources[i])).call();
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
        window.alert('Enable Metamask.');
    }
  }

  rateItem(resource, vote) {
    this.setState({ loading: true });
    this.state.ratingContract.methods.rateItem(String(this.state.id), String(resource), vote).send({ from: this.state.account })
    .on('error', function (error) { window.alert(error.message); })
    .once('receipt', (receipt) => {
        console.log(receipt);
        this.setState({ loading: false });
    })
  }

  async getItemInformation(credentials, resource) {
    const itemInformation = await this.state.ratingContract.methods.ratingsInformation(window.web3.fromAscii(credentials), window.web3.fromAscii(resource)).call();
    return itemInformation;
  }

  async getRatingStatus(credentials, resource) {
    const status = await this.state.ratingContract.methods.usersToResources(window.web3.fromAscii(credentials), window.web3.fromAscii(resource)).call();
    return status;
  }

  checkRatingProcess(credentials, resource, vote, provider) {
    const itemInformation = this.state.ratingContract.methods.ratingsInformation(window.web3.fromAscii(credentials), window.web3.fromAscii(resource)).call();
    const status = this.state.ratingContract.methods.usersToResources(window.web3.fromAscii(credentials), window.web3.fromAscii(resource)).call();
    Promise.all([itemInformation, status]).then(values => { 
      let itemInformation = values[0];
      let isRated = values[1];
      if (!this.checkURL(provider, resource)) {
        window.alert('The resource you are providing is not valid.');
      } else if (isRated && (itemInformation === vote)) {
        window.alert('You have already voted this item.');
      } else {
        this.rateItem(resource, vote);
      }
    });
  }

  fillTable(credentials) {
    let res = [];
    let pos = [];
    let rows = [];

    this.state.ratingContract.methods.getRatedResources().call()
      .then((result) => {
        if (result !== null) {
          for (let i = 0; i < result.length; i++) {
            res.push(window.web3.toAscii(result[i]));
          }
          let promises = [];
          for(let i = 0; i < result.length; i++) {
            let promise = this.state.ratingContract.methods.usersToResources(window.web3.fromAscii(credentials), window.web3.fromAscii(result[i])).call();
            promises.push(promise);
          }
          Promise.all(promises).then(values => { 
            console.log('What you see is what you get: ', values);
            for (let i = 0; i < values.length; i++) {
              if (values[i] === true) {
                pos.push(i);
              }
            }
  
            let promises = [];
            for(let i = 0; i < pos.length; i++) {
              console.log('What is happening here: ', res[pos[i]]);
              let promise = this.state.ratingContract.methods.getResourceInformation(window.web3.toAscii(res[pos[i]])).call();
              promises.push(promise);
            }
            
            Promise.all(promises).then(values => { 
              for (let i = 0; i < values.length; i++) {
                rows.push(this.createData(res[pos[i]], values[i][0], values[i][1]));
              }
              console.log(rows);
              this.setState({ rows });
            });
          });
        }
      });
  }

  checkURL(provider, URL) {
    if (provider.toLowerCase() === 'google') {
      return URL.includes('youtube');
    } else {
      return URL.includes(provider.toLowerCase());
    }
  }

  createData(resource, likes, dislikes) {
    return { resource, likes, dislikes };
  }

  render() {
    const { vote, inputValue } = this.state;
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
                                  console.log('Resource in onSubmit: ', this.state.resource)
                                  console.log('Provider is: ', this.state.provider);
                                  this.checkRatingProcess(this.state.id, resource, vote, this.state.provider);
                                  this.fillTable(this.state.id);
                  }} 
                  style={{ width: 'auto' }}
                >
                    <div style={{ marginTop: 85, alignItems: 'center' }}>
                      <RateInput
                          name="resource"
                          value={inputValue}
                          onChange={this.handleChange}
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
    height: '450px'
  }
}));

 
const RateWrapper = () => {
    const userData = useContext(UserProvider.context);
    const classes = useStyles();
    return (
        <div>
          <Rate userData={userData} c={classes}/>
        </div>
    );
};
 
export default RateWrapper;
