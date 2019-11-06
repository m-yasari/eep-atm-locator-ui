import 'whatwg-fetch';
import * as _ from 'lodash';
import * as endpoints from './endpoints-dev.json';
import { isArray } from 'util';

const mergeFormData = (template, data) => {
    let bodyArr = [];
    Object.keys(template).map(param => {
        let val = template[param];
        if (val === '$' || val.startsWith('$:')) {
            let dataval = _.get(data, param);
            if ((dataval===undefined || dataval===null) && val.startsWith('$:')) {
                dataval = val.substring(2);
            }
            if (isArray(dataval)) {
                dataval = JSON.stringify(dataval);
            }
            val = dataval;
        }
        bodyArr.push(`${param}=${encodeURIComponent(val)}`);
    });
    return bodyArr.join('&');
};

const apiCall = (endpoint, data, paramsObject, authorizarion) => {
    let url = endpoint.url;
    const re = /\{[A-Za-z0-9_]*\}/g;

    if (url.search(re) !== -1) {
        url = _.clone(url);
        let found = url.match(re);
        found.map((key) => {
            url = url.replace(key, paramsObject[key.substring(1, key.length - 1)]);
        });
    }
    if (endpoint.params && paramsObject) {
        let paramArr = [];
        Object.keys(endpoint.params).map(param => {
            let val = endpoint.params[param];
            if (val === '$') {
                val = _.get(paramsObject, param);
            }

            if (val) {
                paramArr.push(`${param}=${encodeURIComponent(val)}`);
            }
        });
        url = `${url}?${paramArr.join('&')}`
    }
    const headers = endpoint.headers || {};
    if (authorizarion) {
        headers.Authorizarion = authorizarion;
    }
    const options = {
        method: endpoint.method,
        headers: headers,
    };
    if (endpoint.method.toUpperCase() === 'POST') {
        const contentType = endpoint.headers['Content-Type'];
        options.body = (contentType && contentType.startsWith('application/json')) ?
            JSON.stringify(data) : ( endpoint.body ? 
            mergeFormData(_.clone(endpoint.body), data) : data);
    }
    return fetch(url, options);
};

export const getEnvironment = (authorizarion) => {
    const endpoint = endpoints['env'];
    return apiCall(endpoint, null, null, authorizarion);
};

export const atmLocator = (obj) => {
    const endpoint = endpoints['atm-locator'];
    return apiCall(endpoint, null, obj);
};

