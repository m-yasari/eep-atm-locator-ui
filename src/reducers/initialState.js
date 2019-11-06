
import * as Constants from '../constants';

const initialState = {
    // initialState
    features: {
        environment: 'production',
    },
    main: {
        activeKey: Constants.CAPTURE_KEY,
        disableTrainTab: true,
        disableSummaryTab: true,
        disableLeaderboardTab: true,
        disablePredictTab: true,
        resetError: null,
        resetInProgress: false,
        resetPopup: false,
    },
    capture: {
        validated: false,
        parseValidated: false,
        inProgress: false,
        parseResult: 'success',
        errors: {}
    },
};

export default initialState;
