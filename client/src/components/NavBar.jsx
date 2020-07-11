
import React, { useContext } from "react";
import Typography from '@material-ui/core/Typography';
import UserProvider from '../contexts/UserProvider';
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";

const useStyles = makeStyles(theme => ({
  root: {
    "& > span": {
      margin: theme.spacing(2)
    }
  }
}));

const NavBar = () => {
    const userData = useContext(UserProvider.context);
    const classes = useStyles();

    return (
        <div className='header' style={{ justifyContent: 'center' }}>
            
            <Typography className='header-logo' style={{float: 'left', fontSize: 28, fontWeight: 'bold', color: '#6a5c71'}}> Rating DApp </Typography>
            
            {
                !_.isEmpty(userData) &&
                <a
                    className="logout-btn"
                    href={"/auth/logout"}
                    style={{ float: "right" }}
                >
                    <div className={classes.root}>
                        <Icon style={{ fontSize: 20, color: '#6a5c71' }}>Logout</Icon>
                    </div>
                </a>
            }
            {
                !_.isEmpty(userData) &&
                <a
                    className="logout-btn"
                    href={"/auth/logout"}
                    style={{ float: "right" }}
                >
                    <div className={classes.root}>
                        <Icon style={{ fontSize: 20, color: '#6a5c71' }}>Ratings</Icon>
                    </div>
                </a>
            }
        </div>
    );
};


export default NavBar;