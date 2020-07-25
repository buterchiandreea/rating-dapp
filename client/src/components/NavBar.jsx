
import React, { Component } from "react";
import Typography from '@material-ui/core/Typography';
import _ from "lodash";
import Icon from "@material-ui/core/Icon";

class NavBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userData: {}
        };
    }

    async componentDidMount() {
        fetch('/user')
            .then(res => res.json())
            .then(res => { 
                this.setState({ userData: res });
            })
            .catch(err => { 
                console.log(err);
            });
      }

    render() {
        return (
            <div className='header' style={{ justifyContent: 'center' }}>
                
                <Typography className='header-logo' style={{float: 'left', fontSize: 28, fontWeight: 'bold', color: '#6a5c71'}}> Rating DApp </Typography>
                
                {
                    !_.isEmpty(this.state.userData) &&
                    <a
                        className="logout-btn"
                        href={"/auth/logout"}
                        style={{ float: "right" }}
                    >
                        <div style={{ margin: '10px', marginTop: '1px' }}>
                            <Icon style={{ fontSize: 24, color: '#6a5c71' }}>Logout</Icon>
                        </div>
                    </a>
                }

            </div>
        );
    };
};


export default NavBar;