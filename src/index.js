import React from 'react';
import {render} from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';

import App from './components/App';
import reducers from './reducers';
import middleware from './middleware';
import initialState from './reducers/initialState';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootElement = document.getElementById('app');
const store = createStore(reducers(), initialState, composeEnhancers(middleware));

render(
    <Provider store={store}>
        <App />
    </Provider>, 
    rootElement);
