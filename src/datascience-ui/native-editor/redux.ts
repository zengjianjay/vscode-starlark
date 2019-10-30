// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';
import { Reducer } from 'redux';

import { IMainState } from '../interactive-common/mainState';
import { PostOffice } from '../react-common/postOffice';
import { combineReducers, createAsyncStore } from '../react-common/reduxUtils';
import { computeEditorOptions, getSettings } from '../react-common/settingsReactSide';
import { FOCUS_CELL, INSERT_ABOVE, INSERT_ABOVE_FIRST, NativeEditorActions, NativeEditorActionTypes } from './actions';
import { Creation } from './reducers/creation';
import { Focus } from './reducers/focus';

export function generateDefaultState(skipDefault: boolean, baseTheme: string): IMainState {
    return {
        // tslint:disable-next-line: no-typeof-undefined
        skipDefault,
        testMode: false,
        baseTheme: (getSettings && getSettings().ignoreVscodeTheme) ? 'vscode-light' : baseTheme,
        editorOptions: computeEditorOptions(),
        cellVMs: [],
        busy: true,
        undoStack: [],
        redoStack: [],
        submittedText: false,
        currentExecutionCount: 0,
        variables: [],
        pendingVariableCount: 0,
        debugging: false,
        knownDark: false,
        variablesVisible: false,
        editCellVM: undefined,
        enableGather: false,
        isAtBottom: true,
        font: {
            size: 14,
            family: 'Consolas, \'Courier New\', monospace'
        }
    };
}

function generateRootReducer(skipDefault: boolean, baseTheme: string): Reducer<IMainState, NativeEditorActions> {
    const defaultState = generateDefaultState(skipDefault, baseTheme);
    return combineReducers<IMainState, NativeEditorActions, NativeEditorActionTypes>(defaultState, {
        [INSERT_ABOVE_FIRST]: Creation.insertAboveFirst,
        [INSERT_ABOVE]: Creation.insertAbove,
        [FOCUS_CELL]: Focus.focusCell
    });
}

export function createStore(skipDefault: boolean, baseTheme: string, postOffice: PostOffice) {
    const store = createAsyncStore<IMainState, NativeEditorActions>(generateRootReducer(skipDefault, baseTheme));

    // Make all messages from the post office dispatch to the store.
    postOffice.addHandler({
        handleMessage(message: string, payload: any): boolean {
            store.dispatch({ type: message, ...payload });
            return true;
        }
    });

    return store;
}
