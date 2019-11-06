import * as _ from 'lodash';
import initialState from '../../reducers/initialState';
import * as type from '../../actions/types';
import * as Constants from '../../constants';

export const capture = (state = [], action) => {
    switch(action.type) {
        case type.ATM_LOC_START_LOAD:
            state = Object.assign({}, state, {
                locations: [],
                inProgress: true,
            })
            break;
        case type.ATM_LOC_FINISHED_LOAD:
            state = Object.assign({}, state, {
                locations: action.data,
                inProgress: false,
            })
            break;
    }
    return state;
}