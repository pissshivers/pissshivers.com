import { combineReducers } from 'redux';

import pissOMeterReducer from './piss-o-meter/reducers';
import sceneReducer from './scene/reducers';

const rootReducer = combineReducers({
    pissOMeter: pissOMeterReducer,
    scene: sceneReducer
});

export default rootReducer;