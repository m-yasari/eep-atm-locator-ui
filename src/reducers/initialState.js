
import * as Constants from '../constants';

const initialState = {
    // initialState
    features: {
        environment: 'production',
    },
    main: {
        activeKey: Constants.CAPTURE_KEY,
        resetError: null,
        resetInProgress: false,
        resetPopup: false,
    },
    capture: {
        validated: false,
        locations: [],
        inProgress: false,
        showingInfoWindow: false,
        activeMarker: null,
        selectedPlace: null,
        errors: {}
    },
};

export default initialState;
