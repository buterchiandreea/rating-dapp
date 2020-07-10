import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1), 
        background: '#6a5c71', 
        color: 'white', 
        marginLeft: theme.spacing(3), 
        marginRight: theme.spacing(3), 
        width: '100px', 
        height: '40px'
    }
}));

const UpRateButton = (props) => {

  const classes = useStyles();

  return (
    <Button
        className={classes.button}
        startIcon={<ThumbUpIcon />}
        size="large"
        onClick={props.onClick}
        type={props.type}
    >
      Like
    </Button>
  );

};

export default UpRateButton;