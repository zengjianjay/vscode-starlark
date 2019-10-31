// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';
import { Action, applyMiddleware, createStore, Middleware, Reducer } from 'redux';
import { logger } from 'redux-logger';


// combineReducers should take in something that is both an action and an action type to func key map
export function combineReducers<S, M>(defaultState: S, map: M): Reducer<S, QueuableAction<M>> {
    return (currentState: S = defaultState, action: QueuableAction<M>) => {
        const func = map[action.type];
        if (typeof func === 'function') {
            // Call the function with assumed arguments. Not sure how to get it to
            // pick up the type from the map at compile time.
            return func(currentState, action, action.queueAction);
        } else {
            return currentState;
        }
    };
}

export type QueuableAction<T> = Action<keyof T> & { queueAction(nextAction: Action<keyof T>): void };

// Got this idea from here:
// https://stackoverflow.com/questions/36730793/can-i-dispatch-an-action-in-reducer
const queueableDispatcher: Middleware = store => next => action => {
    let pendingActions: Action[] = [];
    let complete = false;

    function flush() {
        pendingActions.forEach(a => store.dispatch(a));
        pendingActions = [];
    }

    function queueAction(nextAction: Action) {
        pendingActions.push(nextAction);

        // If already done, run the pending actions (this means
        // this was pushed async)
        if (complete) {
            flush();
        }
    }

    // Add queue to the action
    const modifiedAction = { ...action, queueAction };

    // Call the next item in the middle ware chain
    const res = next(modifiedAction);

    // When done, run all the queued actions
    complete = true;
    flush();

    return res;
};

export function createAsyncStore<S, A extends Action>(reducers: Reducer<S, A>) {
    return createStore(
        reducers,
        applyMiddleware(
            logger,
            queueableDispatcher
        )
    );
}
