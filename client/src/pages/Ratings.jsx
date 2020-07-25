import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import RatingTable from '../components/RatingTable';
import { Link } from 'react-router-dom';


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
    height: '400px', 
    alignItems: 'center'
  }
}));

const Ratings = (props) => {
    const classes = useStyles();
    const { rows } = props.location.state;
    const leftArrow = <React.Fragment>&#xab;</React.Fragment>

    return (
        <div className={classes.root}>
          <Grid container spacing={0} justify="center">
            <div className='header-wrapper' style={{ alignItems: 'center', textAlign: 'center' }}>
                <Typography style={{ fontSize: 50, fontWeight: 'bold', color: 'white', marginTop: -150 }}>
                  Inspect your rating history
                </Typography>
            </div>
            <Grid item xs={3}>
            </Grid>
            <Grid item xs={6} style={{ marginTop: -200, alignItems: 'center', textAlign: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                  <Link to={{
                                pathname: '/rate'
                              }}
                        style={{ textDecoration: 'none', color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 50 }}
                  >
                     {leftArrow} Back
                  </Link>
                </div>
              <RatingTable
                rows={rows}
              >
              </RatingTable>
            </Grid>
            <Grid item xs={3}>
            </Grid>
          </Grid>

        </div>
      );
};

export default Ratings;