import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';


const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1), 
        background: '#6a5c71', 
        color: 'white', 
        marginLeft: theme.spacing(3), 
        marginRight: theme.spacing(3), 
        width: '100px', 
        height: '40px', 
    }
}));

const DownRateButton = (props) => {

  const classes = useStyles();

  return (
      <Button
          className={classes.button}
          startIcon={<ThumbDownIcon />}
          size="large"
          onClick={props.onClick}
          type={props.type}
      >
        Dislike
      </Button>
  );

};

export default DownRateButton;