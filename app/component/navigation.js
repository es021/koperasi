import React, { Component } from 'react';

import { BrowserRouter, Route, NavLink, Switch, Redirect } from 'react-router-dom';

import { LandingUrl } from '../../config/app-config';

import LoginPage from '../page/login';
import SignUpPage from '../page/sign-up';
import {FaqPage, ContactUsPage} from '../page/static';
import AboutPage from '../page/about';
import { HomeAgent, HomeStaff, HomeAdmin } from '../page/home';
import NotFoundPage from '../page/not-found';
import LogoutPage from '../page/logout';
import EditProfilePage from '../page/edit-profile';
import DashboardPage from '../page/dashboard';
import PasswordResetPage from '../page/password-reset';
import PasswordForgotPage from '../page/password-forgot';

import { isAuthorized, getAuthUser, isRoleStudent, isRoleRec, isRoleAdmin } from '../redux/actions/auth-actions';

function getHomeComponent() {
    var homeComponent = null;
    if (isAuthorized()) {
        if (isRoleStudent()) homeComponent = HomeAgent;
        else if (isRoleRec()) homeComponent = HomeStaff;
        else if (isRoleAdmin()) homeComponent = HomeAdmin;
    } else {
        homeComponent = LoginPage;
    }
    return homeComponent;
}

function getMenuItem(COMING_SOON) {
    var homeComponent = getHomeComponent(COMING_SOON);

    var menuItem = [
        {
            url: "/",
            label: "Home",
            icon: "home",
            component: homeComponent,
            bar_app: true,
            bar_auth: true,
            hd_app: true,
            hd_auth: true
        },
        // {
        //     url: "/manage-company/:id/:current",
        //     label: "My Company",
        //     icon: "building",
        //     component: ManageCompanyPage,
        //     bar_app: true,
        //     bar_auth: false,
        //     hd_app: false,
        //     hd_auth: false,
        //     routeOnly: isRoleAdmin() || isRoleOrganizer(),
        //     default_param: { id: getAuthUser().rec_company, current: "about" },
        //     disabled: !isRoleRec() && !isRoleAdmin() && !isRoleOrganizer()
        // },
        {
            url: "/about",
            label: "About",
            icon: "question",
            component: null,
            href: LandingUrl,
            bar_app: COMING_SOON && !(isRoleOrganizer() || isRoleAdmin()),
            bar_app: COMING_SOON && !(isRoleOrganizer() || isRoleAdmin()),
            hd_app: true,
            hd_auth: true
        },
        {
            url: "/faq",
            label: "FAQ",
            icon: "question-circle",
            component: FaqPage,
            bar_app: COMING_SOON && !(isRoleOrganizer() || isRoleAdmin()),
            bar_app: COMING_SOON && !(isRoleOrganizer() || isRoleAdmin()),
            hd_app: true,
            hd_auth: true
        },
        {
            url: "/contact",
            label: "Contact Us",
            icon: "envelope",
            component: ContactUsPage,
            bar_app: COMING_SOON && !(isRoleOrganizer() || isRoleAdmin()),
            bar_app: COMING_SOON && !(isRoleOrganizer() || isRoleAdmin()),
            hd_app: true,
            hd_auth: true
        },
        {
            url: "/login",
            label: "Login",
            icon: "sign-in",
            component: LoginPage,
            bar_app: false,
            bar_auth: true,
            hd_app: false,
            hd_auth: true,
            allRoute: true
        },
        {
            url: "/logout",
            label: "Logout",
            icon: "sign-out",
            component: LogoutPage,
            bar_app: false,
            bar_auth: false,
            hd_app: true,
            hd_auth: false
        },
        // {
        //     url: "/sign-up",
        //     label: "Sign Up",
        //     icon: "user-plus",
        //     component: SignUpPage,
        //     bar_app: false,
        //     bar_auth: true,
        //     hd_app: false,
        //     hd_auth: true
        // }
    ];
    // ############################################################################/
    /**** ROUTE ONLY *******/
    menuItem.push(...[
        {
            url: "/password-reset/:token/:user_id",
            component: PasswordResetPage,
            bar_app: true,
            bar_auth: true,
            hd_app: true,
            hd_auth: true,
            routeOnly: true
        },
        {
            url: "/password-forgot",
            component: PasswordForgotPage,
            bar_app: true,
            bar_auth: true,
            hd_app: true,
            hd_auth: true,
            routeOnly: true
        },
        {
            url: "/edit-profile/:current",
            component: EditProfilePage,
            bar_app: true,
            bar_auth: false,
            hd_app: true,
            hd_auth: false,
            routeOnly: true
        }
    ]);

    return menuItem;
}

// ############################################################################/
/**** HELPER FUNCTION *******/

export function getRoute(path, COMING_SOON) {
    var isLog = isAuthorized();
    var menuItem = getMenuItem(COMING_SOON);
    var routes = menuItem.map(function (d, i) {
        //restricted
        if (d.disabled) {
            return false;
        }

        var exact = (d.url === "/") ? true : false;

        if (!d.allRoute) {
            if (isLog && !(d.hd_app || d.bar_app)) {
                return;
            }

            if (!isLog && !(d.hd_auth || d.bar_auth)) {
                return;
            }
        }

        return (<Route path={`${path}${d.url}`} exact={exact} key={i} component={d.component}></Route>);
    });

    return (<Switch>
        {routes}
        <Route path="*" component={NotFoundPage} />
    </Switch>);
}


// strictly for getBar only
// wont work for getRoute
function isBarValid(isHeader, isLog, d) {
    if (d.disabled) {
        return false;
    }

    // Header and is logged in
    if (isHeader && isLog && !d.hd_app) {
        return false;
    }

    // Header and is logged out
    if (isHeader && !isLog && !d.hd_auth) {
        return false;
    }

    // Bar and is logged in
    if (!isHeader && isLog && !d.bar_app) {
        return false;
    }

    // Bar and is logged out
    if (!isHeader && !isLog && !d.bar_auth) {
        return false;
    }
    return true;
}


export function getBar(path, COMING_SOON, isHeader = false) {

    var isLog = isAuthorized();
    var menuItem = getMenuItem(COMING_SOON);

    var menuList = menuItem.map(function (d, i) {
        var exact = (d.url === "/") ? true : false;

        if (d.routeOnly) {
            return;
        }

        if (!isBarValid(isHeader, isLog, d)) {
            return;
        }

        var url = d.url;
        if (d.default_param) {
            for (var key in d.default_param) {
                url = url.replace(`:${key}`, d.default_param[key]);
            }
        }

        if (d.component === null && d.href != "") {
            return <a href={d.href} target="blank">
                <li>
                    {(isHeader) ? "" : <i className={`fa fa-${d.icon}`}></i>}
                    <span className="menu_label">{d.label}</span>
                </li>
            </a>
        }

        return (<NavLink to={`${path}${url}`} exact={exact} key={i} activeClassName="active">
            <li>
                {(isHeader) ? "" : <i className={`fa fa-${d.icon}`}></i>}
                <span className="menu_label">{d.label}</span>
            </li>
        </NavLink>);
    });

    return (<ul>{menuList}</ul>);
}
