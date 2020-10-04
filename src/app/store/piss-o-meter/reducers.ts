import { createReducer, getType } from 'typesafe-actions';

import { PissOMeter} from './types';
import { PISS_BASE, PISS_MAX, PISS_LEVEL, PISS_STEPS, PISS_MIN, PISS_DRAIN_DURATION } from './constants';
import { poundBeer, drainPiss, setDefaults } from './actions';

const pissOMeterReducer = createReducer({
        level: PISS_LEVEL,
        max: PISS_MAX,
        min: PISS_MIN,
        base: PISS_BASE,
        drainDurration: PISS_DRAIN_DURATION,
        steps: PISS_STEPS,
        fuckedUp: false
    } as PissOMeter )
    .handleAction(setDefaults, (state, action) => Object.assign(state, action.payload))
    .handleAction(poundBeer, (state, _) => {
        let newState = { ...state };
        if (newState.level > newState.max){
            newState.level -= newState.steps;
        }
        if (!newState.fuckedUp && newState.level == newState.max){
            newState.fuckedUp = true;
        }
        return newState;
    })
    .handleAction(drainPiss, (state, _) => {
        let newState = { ...state };
        newState.level = newState.min
        newState.fuckedUp = false;
        return newState;
    });

    export default pissOMeterReducer;
    export type PissOMeterState = ReturnType<typeof pissOMeterReducer>