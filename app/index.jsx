import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, NavLink, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { isAuthorized, isComingSoon } from "./redux/actions/auth-actions";
import { addLog } from './redux/actions/other-actions';
import { LogEnum } from '../config/db-config';

//console.log(process.env.NODE_ENV);

//import {User} from '../config/db-config'; 
require("./css/general.scss");

//console.log(User);

require("./lib/util.js");

//require("./lib/AutoComplete.js");

require("./css/app.scss");
require("./css/content.scss");
require("./css/header.scss");
require("./css/left-bar.scss");
//require("./lib/font-awesome-4.7.0/css/font-awesome.css");

import * as Navigation from "./component/navigation";
import HeaderLayout from "./layout/header-layout";
import FooterLayout from "./layout/footer-layout";
import LeftBarLayout from "./layout/left-bar-layout";

//singleton
import FocusCard from "./component/focus-card";
import BlockLoader from "./component/block-loader";

class PrimaryLayout extends React.Component {
	componentWillMount() {
	}

	render() {
		//scroll to top
		console.log("PrimaryLayout");
		window.scrollTo(0, 0);
		var path = this.props.match.path;

		//var logData = window.location.pathname;
		//logData = logData.replace(path, "");
		//addLog(LogEnum.EVENT_OPEN_PAGE, logData);

		var headerMenu = Navigation.getBar(path, true);
		var sideMenu = Navigation.getBar(path);
		var route = Navigation.getRoute(path);

		if (!isAuthorized()) {
			return (<div className="primary-layout landing-page">
				<HeaderLayout menuList={headerMenu}></HeaderLayout>
				<div className="content">
					<div className="main">
						{route}
					</div>
				</div>
				<FooterLayout></FooterLayout>
			</div>);
		} else {
			return (<div className="primary-layout">
				<FocusCard></FocusCard>
				<BlockLoader></BlockLoader>
				<HeaderLayout menuList={headerMenu}></HeaderLayout>
				<LeftBarLayout menuList={sideMenu}></LeftBarLayout>
				<div className="content">
					<div className="main">
						{route}
					</div>
				</div>
				<FooterLayout></FooterLayout>
			</div>);
		}
	}
}

import AuthorizedRoute from "./component/authorize-route";
import { RootPath } from "../config/app-config";
const App = () => (
	<Provider store={store}>
		<BrowserRouter>
			<Switch>
				<AuthorizedRoute path={`${RootPath}/app`} component={PrimaryLayout} />
				<Route path={`${RootPath}/auth`} component={PrimaryLayout} />
			</Switch>
		</BrowserRouter>
	</Provider>
);
render(<App />, document.getElementById("app"));