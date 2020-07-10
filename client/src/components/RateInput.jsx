import React from 'react';
import {
    ThemeProvider,
    makeStyles,
    createMuiTheme,
  } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import { blueGrey } from '@material-ui/core/colors';


const theme = createMuiTheme({
    palette: {
      primary: blueGrey
    }
});

const useStyles = makeStyles((theme) => ({
    input: {
      margin: 'auto'
    }
}));

const RateInput = (props) => {

  const classes = useStyles();

  return (

    <ThemeProvider theme={theme}>
        <TextField
          className={classes.input}
          label="Resource"
          variant="outlined"
          id="resource"
          style={{ width: '400px' }}
          type={props.type}
          onChange={props.onChange}
        />
    </ThemeProvider>
  );

};

export default RateInput;