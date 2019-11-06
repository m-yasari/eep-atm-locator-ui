import * as type from './types';
import * as _ from 'lodash';
import * as Constants from '../constants';
import {modelsConfig} from '../components/Train/config';
import { importFile, parseSetup, parse, jobStatus, frameSummary, 
    automlBuilder, automlLeaderboard, modelMetrics, predict, 
    getEnvironment, uploadFile, removeAll } from '../api';
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

export const setDisableSummaryFlag = (flag) => ({ type: type.DISABLE_SUMMARY_TAB, flag: flag});

export const setDisableTrainFlag = (flag) => ({ type: type.DISABLE_TRAIN_TAB, flag: flag});

export const setDisableLeaderboardFlag = (flag) => ({ type: type.DISABLE_LEADERBOARD_TAB, flag: flag});

export const setDisablePredictFlag = (flag) => ({ type: type.DISABLE_PREDICT_TAB, flag: flag});

export const openSettingsTrain = (showPopup) => ({ type: type.OPEN_SETTINGS_TRAIN, showPopup: showPopup});

export const openResetPopup = (showPopup) => ({ type: type.RESET_POPUP, showPopup: showPopup});

