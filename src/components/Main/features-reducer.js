import * as _ from 'lodash';
import * as type from '../../actions/types';

export const features = (state = {}, action) => {
    switch(action.type) {
        case type.SET_ENVIRONMENT:
            state = Object.assign({}, state, action.env);
            break;
    }
    return state;
}