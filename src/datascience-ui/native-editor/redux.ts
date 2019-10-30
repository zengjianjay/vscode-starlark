// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';
import { Reducer } from 'redux';

import { IMainState } from '../interactive-common/mainState';
import { PostOffice } from '../react-common/postOffice';
import { combineReducers, createAsyncStore } from '../react-common/reduxUtils';
import { computeEditorOptions, getSettings } from '../react-common/settingsReactSide';
import {
    ADD_CELL,
    EXECUTE_ALL_CELLS,
    EXECUTE_CELL,
    FOCUS_CELL,
    INSERT_ABOVE,
    INSERT_ABOVE_FIRST,
    INSERT_BELOW,
    NativeEditorActions,
    NativeEditorActionTypes
} from './actions';
import { Creation } from './reducers/creation';
import { Execution } from './reducers/execution';
import { Focus } from './reducers/focus';
import { TOGGLE_VARIABLE_EXPLORER, REFRESH_VARIABLES } from './actions';
import { validateVariablesInFrame } from '../../test/debugger/utils';
import { Variables } from './reducers/variables';

export function generateDefaultState(skipDefault: boolean, baseTheme: string, postOffice: PostOffice): IMainState {
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
        },
        sendMessage: postOffice.sendMessage.bind(postOffice)
    };
}

function generateRootReducer(skipDefault: boolean, baseTheme: string, postOffice: PostOffice): Reducer<IMainState, NativeEditorActions> {
    const defaultState = generateDefaultState(skipDefault, baseTheme, postOffice);
    return combineReducers<IMainState, NativeEditorActions, NativeEditorActionTypes>(defaultState, {
        [INSERT_BELOW]: Creation.insertBelow,
        [INSERT_ABOVE_FIRST]: Creation.insertAboveFirst,
        [INSERT_ABOVE]: Creation.insertAbove,
        [FOCUS_CELL]: Focus.focusCell,
        [ADD_CELL]: Creation.addNewCell,
        [EXECUTE_CELL]: Execution.executeCell,
        [EXECUTE_ALL_CELLS]: Execution.executeAllCells,
        [TOGGLE_VARIABLE_EXPLORER]: Variables.toggleVariableExplorer,
        [REFRESH_VARIABLES]: Variables.refreshVariables
    });
}

export function createStore(skipDefault: boolean, baseTheme: string) {
    // Create a post office to listen to store dispatches and allow reducers to
    // send messages
    const postOffice = new PostOffice();

    // Send this into the root reducer
    const store = createAsyncStore<IMainState, NativeEditorActions>(generateRootReducer(skipDefault, baseTheme, postOffice));

    // Make all messages from the post office dispatch to the store.
    postOffice.addHandler({
        // tslint:disable-next-line: no-any
        handleMessage(message: string, payload: any): boolean {
            store.dispatch({ type: message, ...payload });
            return true;
        }
    });

    return store;
}
