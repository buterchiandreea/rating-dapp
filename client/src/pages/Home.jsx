import React from 'react';
import LoginCardList from '../components/LoginCardList';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    alignContent: 'strech', 
  },
  typography: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.grey.secondary
  }, 
  paper: {
    height: '400px'
  }
}));

const Home = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
          <Grid container spacing={0} justify="center">
            <div className='header-wrapper' style={{ alignItems: 'center', textAlign: 'center' }}>
                <Typography style={{ fontSize: 50, fontWeight: 'bold', color: 'white', marginTop: -150 }}>
                  Rate media contents from your favourite providers
                </Typography>
            </div>
            <Grid item xs={3}>
            </Grid>
            <Grid item xs={6} style={{ marginTop: -200, alignItems: 'center', textAlign: 'center' }}>
              <Paper className={classes.paper}>
                <div className='login-form'>
                  <Typography style={{ fontSize: 32, color: 'white' }}>
                    Sign in to start the Rating Adventure
                  </Typography>
                </div>
                <div style={{ marginTop: 70, alignItems: 'center'}}>
                  <LoginCardList/>
                </div>
              </Paper> 
            </Grid>
            <Grid item xs={3}>
            </Grid>
          </Grid>

        </div>
      );
};

export default Home;