// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';
import { connect } from 'react-redux';
import { Action, Reducer } from 'redux';

import { IMainState } from '../interactive-common/mainState';
import { combineReducers, createAsyncStore } from '../react-common/reduxUtils';
import { computeEditorOptions, getSettings } from '../react-common/settingsReactSide';
import { actionCreators, NativeEditorActions, NativeEditorActionTypes, INSERT_ABOVE_FIRST, INSERT_ABOVE } from './actions';
import { NativeEditor } from './nativeEditor';
import { Movement } from './reducers/movement';
import { Cells } from './reducers/cells';

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

function generateRootReducer(skipDefault: boolean, baseTheme: string): Reducer<IMainState> {
    const defaultState = generateDefaultState(skipDefault, baseTheme);
    return combineReducers<IMainState, NativeEditorActions, NativeEditorActionTypes>(defaultState, {
        [INSERT_ABOVE_FIRST]: Movement.insertAboveFirst,
        [INSERT_ABOVE]: Cells.insertAbove
    }
    );
}

function mapStateToProps(state: IMainState): IMainState {
    return state;
}

export function generateConnected() {
    return connect(
        mapStateToProps,
        actionCreators
    )(NativeEditor);
}

export function createStore(skipDefault: boolean, baseTheme: string) {
    return createAsyncStore<IMainState, Action>(generateRootReducer(skipDefault, baseTheme));
}
