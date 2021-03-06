import axios from 'axios';
import { store } from '../store.js';
import { AppConfig, TestUser } from '../../../config/app-config';
import { AuthUserKey } from '../../../config/auth-config';
import { User, UserEnum } from '../../../config/db-config';
import { CareerFair, CareerFairOrg } from '../../../config/cf-config';
import { Time } from '../../lib/time';

export function isComingSoon() {
    return false;
    
    if (isTestUser()) {
        return false;
    }

    var isComingSoon = true;
    var cfObj = getCFObj();

    var timenow = Time.getUnixTimestampNow();

    //check start time
    if (cfObj.start != null) {
        var timestart = Time.convertDBTimeToUnix(cfObj.start);
        if (timenow >= timestart) {
            isComingSoon = false;
        }
    }

    if (cfObj.test_start != null && cfObj.test_end != null) {
        var timetest_start = Time.convertDBTimeToUnix(cfObj.test_start);
        var timetest_end = Time.convertDBTimeToUnix(cfObj.test_end);

        if (timenow >= timetest_start && timenow <= timetest_end) {
            isComingSoon = false;
        }
    }

    return isComingSoon;
}

// ############################################
// CF
export function getCFOrg() {
    return CareerFairOrg[getCF()];
}

export function getCFObj() {
    return CareerFair[getCF()];
}

export function getCF() {
    return store.getState().auth.cf;
}

export function isAuthorized() {
    return store.getState().auth.isAuthorized;
}

export function getOtherRecs() {
    if (isRoleRec()) {
        return store.getState().auth.user.company.recruiters;
    }
    return [];
}


// ############################################
// Auth
export function getCompany() {
    if (!isRoleRec()) {
        return null;
    } else {
        return getAuthUser().company;
    }
}

export function getAuthUser() {
    if (!isAuthorized()) {
        return {};
    }
    return store.getState().auth.user;
}

export function isCookieEnabled() {
    return store.getState().auth.cookie;
}

/*
export function isRoleStudent() {
    return getAuthUser().role === UserEnum.ROLE_STUDENT;
}

export function isRoleRec() {
    return getAuthUser().role === UserEnum.ROLE_RECRUITER;
}

export function isRoleOrganizer() {
    return getAuthUser().role === UserEnum.ROLE_ORGANIZER;
}

export function isRoleSupport() {
    return getAuthUser().role === UserEnum.ROLE_SUPPORT;
}
*/

export function isRoleAdmin() {
    return getAuthUser().role === UserEnum.ROLE_ADMIN;
}

export function isRoleAgent() {
    return getAuthUser().role === UserEnum.ROLE_AGENT;
}

export function isRoleStaff() {
    return getAuthUser().role === UserEnum.ROLE_STAFF;
}

export function isTestUser() {
    return TestUser.indexOf(getAuthUser().ID) >= 0;
}

// ############################################
// REDUX ACTIONS

export const UPDATE_USER = "UPDATE_USER";
export function updateAuthUser(user, force = false) {

    //filter out not auth related
    var auth = {};
    for (var k in user) {
        if (AuthUserKey.indexOf(k) >= 0) {
            auth[k] = user[k];
        }
    }

    store.dispatch({
        type: UPDATE_USER,
        payload: auth
    });
}

export const DO_LOGIN = "DO_LOGIN";
export function login(email, password, cf) {
    return function (dispatch) {
        dispatch({
            type: DO_LOGIN,
            payload: axios.post(AppConfig.Api + "/auth/login", { email: email, password: password, cf: cf })
        });
    };
}


export const DO_LOGOUT = "DO_LOGOUT";
export function logout() {
    return function (dispatch) {
        dispatch({
            type: DO_LOGOUT
        });
    };
}

//#############################################
// SERVER API

export function register(user) {
    return axios.post(AppConfig.Api + "/auth/register", { user: user });
}

export function activateAccount(key, user_id) {
    return axios.post(AppConfig.Api + "/auth/activate-account", { key: key, user_id: user_id });
}

export function passwordResetRequest(user_email) {
    return axios.post(AppConfig.Api + "/auth/password-reset-request",
        {
            user_email: user_email
        });
}

export function passwordResetToken(new_password, token, user_id) {
    return axios.post(AppConfig.Api + "/auth/password-reset-token",
        {
            new_password: new_password,
            token: token,
            user_id: user_id
        });
}

export function passwordResetOld(new_password, old_password, user_id) {
    return axios.post(AppConfig.Api + "/auth/password-reset-old",
        {
            new_password: new_password,
            old_password: old_password,
            user_id: user_id
        });
}