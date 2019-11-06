import { getEnvironment } from './api';

const getAPIKey = () => {
    getEnvironment().then(resp => {
        if (!resp.ok) {
            throw new StatusException(resp.status, resp.statusText);
        }
        return resp.json();
    }).then((json) => { // both fetching and parsing succeeded
        window.myEnv = json;
        console.log("Initialize API KEY:", window.myEnv.apiKey);
    }).catch(err => { // either fetching or parsing failed
        if (err.status >= 400) {
            console.log(`getEnvironment error: ${err.statusText}`);
        } else {
            console.log(`getEnvironment error: ${err}`);
        }
    });
};

getAPIKey();