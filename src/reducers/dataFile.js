import * as _ from 'lodash';
import * as type from '../actions/types';
import initialState from './initialState';

export const dataFile = (state = [], action) => {
    let newState;
    switch(action.type) {
        case type.IMPORT_DATA_FILE_START:
            newState = Object.assign({}, _.get(initialState.dataFile, action.category), {
                inProgress: true,
                name: action.filename
            });
            state = Object.assign({}, state, _.set({}, action.category, newState));
            break;
        case type.IMPORT_DATA_FILE_COMPLETED:
            newState  = Object.assign({}, _.get(state, action.category), {
                inProgress: false,
                imported: !action.error,
                data: action.data,
                apiError: action.error
            });
            state = Object.assign({}, state, _.set({}, action.category, newState));
            break;
    }
    return state;
} 