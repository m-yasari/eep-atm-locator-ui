import * as _ from 'lodash';
import initialState from '../../reducers/initialState';
import * as type from '../../actions/types';
import * as Constants from '../../constants';

export const dataFile = (state = [], action) => {
    let fileImport = _.get(state, action.category);
    let newFileImport = null;
    switch(action.type) {
        case type.IMPORT_FILENAME:
            newFileImport  = Object.assign({}, fileImport, {
                name: action.filename,
            });
            break;
        case type.IMPORT_UPLOAD_FILENAME:
            newFileImport  = Object.assign({}, fileImport, {
                uploadFilename: action.filename,
            });
            break;
        case type.IMPORT_DATA_FILE_START:
            newFileImport = Object.assign({}, fileImport, {
                inProgress: true,
                apiError: null,
            });
            break;
        case type.IMPORT_DATA_FILE_COMPLETED:
            newFileImport  = Object.assign({}, fileImport, {
                imported: true,
                importedData: action.data,
            });
            break;
        case type.IMPORT_FILE_DONE:
            newFileImport = Object.assign({}, fileImport, {
                inProgress: false,
                apiError: action.error,
            });
            break;
        case type.PARSE_SETUP_START:
            newFileImport  = Object.assign({}, fileImport, {
                parsedSetup: false,
                parsed: false,
                parsedSetupData: null,
                parsedData: null,
            });
            break;
        case type.PARSE_SETUP_COMPLETED:
            newFileImport  = Object.assign({}, fileImport, {
                parseSetup: true,
                parsedSetupData: action.data,
            });
            break;
        case type.PARSE_START:
            newFileImport  = Object.assign({}, fileImport, {
                inProgress: true,
                progress: 0,
                progressMsg: '',
                parsed: false,
                parsedData: null,
            });
            break;
        case type.PARSE_IN_PROGRESS:
            newFileImport  = Object.assign({}, fileImport, {
                progress: Math.round(action.job.progress * 100),
                progressMsg: action.job.progress_msg,
            });
            break;
        case type.PARSE_COMPLETED:
            newFileImport  = Object.assign({}, fileImport, {
                parsed: true,
                parsedData: action.data,
                reparseRequired: false,
            });
            break;
        case type.CHANGE_COLUMN_TYPE:
            fileImport.parsedSetupData.column_types[action.column] = action.columnType;

            newFileImport  = Object.assign({}, fileImport, {
                parsed: true,
                parsedSetupData: _.clone(fileImport.parsedSetupData),
                reparseRequired: true,
            });
            break;
    }
    if (newFileImport) {
        state = Object.assign({}, state, _.set({}, action.category, newFileImport));
    }
    return state;
}