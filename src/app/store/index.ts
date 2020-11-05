import { createStore} from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer, {RootState} from './root-reducer';

const persistConfig = {
    key: 'root',
    storage: storage,
    stateReconciler: autoMergeLevel2
}

const composeEnhancers = composeWithDevTools({
    trace: true
  });

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer)
export let store = createStore(persistedReducer, composeEnhancers())
export let persistor = persistStore(store);
// export * from './root-types';
export * from './root-selectors';

// export default () => {
//     let store = createStore(persistedReducer)
//     let persistor = persistStore(store)
//     return { store, persistor }
//   }