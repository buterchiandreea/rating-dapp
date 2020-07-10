import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ListAltIcon from '@material-ui/icons/ListAlt';


const useStyles = makeStyles((theme) => ({
    button: {
        marginTop: theme.spacing(1.5), 
        color: '#2a7f88'
    }
}));

const InspectButton = () => {

  const classes = useStyles();

  return (
    <Tooltip title="Inspect rating history">
        <IconButton 
            className={classes.button}
            size="large"

        >
            <ListAltIcon />
        </IconButton>
    </Tooltip>
  );

};

export default InspectButton;