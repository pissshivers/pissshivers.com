import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store, persistor } from './app/store';

import './main.scss';
import App from './app/';
import { PersistGate } from 'redux-persist/integration/react';

// const store = Store().store;
// const persistor = Store().persistor;

// persistor.purge();
const Root = () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>
)

ReactDOM.render(<Root />, document.getElementById('root'));