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
            newState.drainDurration = (1 - (newState.level/newState.min)) * PISS_DRAIN_DURATION;
        }
        if (!newState.fuckedUp && newState.level == newState.max){
            newState.fuckedUp = true;
        }
        return newState;
    })
    .handleAction(drainPiss, (state, action) => {
        let newState = Object.assign(state, action.payload);
        if (newState.fuckedUp){
            newState.fuckedUp = newState.level == newState.max;
        }
        return newState;
    });

    export default pissOMeterReducer;
    export type PissOMeterState = ReturnType<typeof pissOMeterReducer>