import * as type from './types';
import * as _ from 'lodash';
import * as Constants from '../constants';
import { getEnvironment, atmLocator } from '../api';
import mapDispatchToProps from './creator';

export const setEnvironment = (env) => ({ type: type.SET_ENVIRONMENT, env: env });

export const resetState = (statePath) => (
    {
        type: type.RESET_STATE,
        statePath: statePath,
    }
);

export const changeState = (statePath, val, attr = null) => (
    {
        type: type.CHANGE_STATE,
        attribute: attr,
        value: val,
        statePath: statePath,
    }
);

export const resetError = (error) => ({ type: type.RESET_ERROR, error: error });

export const resetStart = () => ({ type: type.RESET_START });

export const resetCompleted = () => ({ type: type.RESET_COMPLETED });

export const changeMainTab = (activeKey) => ({ type: type.CHANGE_MAIN_TAB, activeKey: activeKey });

export const openResetPopup = (showPopup) => ({ type: type.RESET_POPUP, showPopup: showPopup});

export const startLoadingATMs = () => ({ type: type.ATM_LOC_START_LOAD });

export const finishLoadingATMs = (data) => ({ type: type.ATM_LOC_FINISHED_LOAD, data: data });

export const callGetEnvironment = () => (dispatch, getState) => {
    getEnvironment().then(resp => {
        if (!resp.ok) {
            throw new StatusException(resp.status, resp.statusText);
        }
        return resp.json();
    }).then((json) => { // both fetching and parsing succeeded
        dispatch(setEnvironment(json));
    }).catch(err => { // either fetching or parsing failed
        if (err.status >= 400) {
            console.log(`getEnvironment error: ${err.statusText}`);
        } else {
            console.log(`getEnvironment error: ${err}`);
        }
    });
};

export const callATMLocator = (data) => (dispatch, getState) => {
    dispatch(startLoadingATMs());
    atmLocator(data).then(resp => {
        if (!resp.ok) {
            throw new StatusException(resp.status, resp.statusText);
        }
        return resp.json();
    }).then((json) => { // both fetching and parsing succeeded
        dispatch(finishLoadingATMs(json));
    }).catch(err => { // either fetching or parsing failed
        if (err.status >= 400) {
            console.log(`getEnvironment error: ${err.statusText}`);
        } else {
            console.log(`getEnvironment error: ${err}`);
        }
    });
};

