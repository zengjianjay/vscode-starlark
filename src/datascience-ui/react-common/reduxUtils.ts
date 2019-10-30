// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';
import { Action, applyMiddleware, createStore, Middleware, Reducer, AnyAction } from 'redux';
import { logger } from 'redux-logger';

// Special reducer that doesn't have to handle the default state case
type DefinedReducer<S = any, A extends Action = AnyAction> = (
    state: S,
    action: A
) => S;

// Borrowed some of these from redux-starter-kit
declare type Actions<T extends keyof any = string> = Record<T, Action>;

declare type CaseReducer<S = any, A extends Action = AnyAction> = (state: S, action: A) => S | void;

declare type CaseReducers<S, AS extends Actions> = {
    [T in keyof AS]: AS[T] extends Action ? CaseReducer<S, AS[T]> : void;
};
export function combineReducers<S, A extends Action<K>, K extends string>(defaultState: S, map: CaseReducers<S, Actions<K>>): Reducer<S, A> {
    return (currentState: S = defaultState, action: A) => {
        const func = map[action.type] as DefinedReducer<S, A>;
        if (typeof func === 'function') {
            return func(currentState, action);
        } else {
            return currentState;
        }
    };
}

export type QueuableAction = Action & { queueAction(nextAction: Action): void };

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
}

export function createAsyncStore<S, A extends Action>(reducers: Reducer<S, A>) {
    return createStore(
        reducers,
        applyMiddleware(
            logger,
            queueableDispatcher
        )
    );
}
