import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import ProfileCard from '../component/profile-card';
import { isAuthorized, getAuthUser } from '../redux/actions/auth-actions';
import { getWindowWidth } from '../lib/util';
import { getPositionStr } from '../component/profile-card-img';
import { RootPath } from '../../config/app-config';

import store from '../redux/store';

export default class LeftBarLayout extends React.Component {
    constructor(props) {
        super(props);
        console.log("root path");
        console.log(RootPath);
        this.state = {
            isMdWin: (getWindowWidth() <= 680)
        }
    }

    componentWillMount() {
        window.addEventListener('resize', (event) => {
            if (getWindowWidth() <= 680) {
                if (!this.state.isMdWin) {
                    this.setState(() => {
                        return { isMdWin: true }
                    });
                }
            } else {
                if (this.state.isMdWin) {
                    this.setState(() => {
                        return { isMdWin: false }
                    });
                }
            }
        });
    }

    render() {
        console.log("Render Left Bar");

        //var authUser = Object.assign({}, getAuthUser());
        // if (this.state.isMdWin && typeof authUser["img_pos"] !== "undefined" && authUser["img_pos"] !== null) {
        //     if (authUser["img_pos"].indexOf("px") > -1) {
        //         authUser["img_pos"] = getPositionStr(25, authUser["img_pos"], "px", true);
        //     }
        // }

        var profile = null;
        if (isAuthorized()) {
            var authUser = getAuthUser();
            var pcBody = <small>
                <a>Edit Profile</a>
            </small>;

            profile = <div className="left_bar_greet">
                <i>Welcome,</i><br></br>
                <b>{authUser.first_name}</b>
                <br></br>{authUser.last_name}
                <br></br>
                <small>
                    <i className="text-muted">{authUser.role.capitalize()}</i><br></br>
                </small>
            </div>;
        } else {
            profile = <br></br>;
        }

        var nav = <div className="left_bar_nav">
            {this.props.menuList}
        </div>;

        return (<left_bar>
            {profile}
            {nav}
        </left_bar>);
    }
}