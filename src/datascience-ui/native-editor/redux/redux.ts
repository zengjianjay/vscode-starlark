// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';
import { Reducer } from 'redux';

import { InteractiveWindowMessages } from '../../../client/datascience/interactive-common/interactiveWindowTypes';
import { IMainState } from '../../interactive-common/mainState';
import { PostOffice } from '../../react-common/postOffice';
import { combineReducers, createAsyncStore, QueuableAction } from '../../react-common/reduxUtils';
import { computeEditorOptions, getSettings } from '../../react-common/settingsReactSide';
import {
    INativeEditorActionMapping, NativeEditorActionTypes,
} from './actions';
import { Creation } from './reducers/creation';
import { Execution } from './reducers/execution';
import { Focus } from './reducers/focus';
import { Helpers } from './reducers/helpers';
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

const reducers: INativeEditorActionMapping = {
    // Explicit actions
    [NativeEditorActionTypes.INSERT_ABOVE]: Creation.insertAbove,
    [NativeEditorActionTypes.INSERT_ABOVE_FIRST]: Creation.insertAboveFirst,
    [NativeEditorActionTypes.INSERT_BELOW]: Creation.insertBelow,
    [NativeEditorActionTypes.FOCUS_CELL]: Focus.focusCell,
    [NativeEditorActionTypes.ADD_NEW_CELL]: Creation.addNewCell,
    [NativeEditorActionTypes.EXECUTE_CELL]: Execution.executeCell,
    [NativeEditorActionTypes.EXECUTE_ALL_CELLS]: Execution.executeAllCells,
    [NativeEditorActionTypes.TOGGLE_VARIABLE_EXPLORER]: Variables.toggleVariableExplorer,
    [NativeEditorActionTypes.REFRESH_VARIABLES]: Variables.refreshVariables,
};

function generateRootReducer(skipDefault: boolean, baseTheme: string, postOffice: PostOffice): Reducer<IMainState, QueuableAction<INativeEditorActionMapping>> {
    const defaultState = generateDefaultState(skipDefault, baseTheme, postOffice);
    return combineReducers<IMainState, INativeEditorActionMapping>(defaultState, {
        // Explicit actions
        [NativeEditorActionTypes.INSERT_ABOVE]: Creation.insertAbove,
        [NativeEditorActionTypes.INSERT_ABOVE_FIRST]: Creation.insertAboveFirst,
        [NativeEditorActionTypes.INSERT_BELOW]: Creation.insertBelow,
        [NativeEditorActionTypes.FOCUS_CELL]: Focus.focusCell,
        [NativeEditorActionTypes.ADD_NEW_CELL]: Creation.addNewCell,
        [NativeEditorActionTypes.EXECUTE_CELL]: Execution.executeCell,
        [NativeEditorActionTypes.EXECUTE_ALL_CELLS]: Execution.executeAllCells,
        [NativeEditorActionTypes.TOGGLE_VARIABLE_EXPLORER]: Variables.toggleVariableExplorer,
        [NativeEditorActionTypes.REFRESH_VARIABLES]: Variables.refreshVariables,

        // // Messages from the webview (some are ignored)
        // [InteractiveWindowMessages.StartCell]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.FinishCell]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.UpdateCell]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.GotoCodeCell]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.CopyCodeCell]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.RestartKernel]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.Export]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.GetAllCells]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.ReturnAllCells]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.DeleteCell]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.DeleteAllCells]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.Undo]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.Redo]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.ExpandAll]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.CollapseAll]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.StartProgress]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.StopProgress]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.Interrupt]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.SubmitNewCell]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.UpdateSettings]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.DoSave]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.SendInfo]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.Started]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.AddedSysInfo]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.RemoteAddCode]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.RemoteReexecuteCode]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.Activate]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.ShowDataViewer]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.GetVariablesRequest]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.GetVariablesResponse]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.GetVariableValueRequest]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.GetVariableValueResponse]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.VariableExplorerToggle]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.ProvideCompletionItemsRequest]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.CancelCompletionItemsRequest]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.ProvideCompletionItemsResponse]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.ProvideHoverRequest]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.CancelHoverRequest]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.ProvideHoverResponse]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.ProvideSignatureHelpRequest]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.CancelSignatureHelpRequest]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.ProvideSignatureHelpResponse]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.AddCell]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.EditCell]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.RemoveCell]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.SwapCells]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.InsertCell]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.LoadOnigasmAssemblyRequest]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.LoadOnigasmAssemblyResponse]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.LoadTmLanguageRequest]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.LoadTmLanguageResponse]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.OpenLink]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.ShowPlot]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.StartDebugging]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.StopDebugging]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.GatherCode]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.LoadAllCells]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.LoadAllCellsComplete]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.ScrollToCell]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.ReExecuteCell]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.NotebookIdentity]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.NotebookDirty]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.NotebookClean]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.SaveAll]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.NativeCommand]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.VariablesComplete]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.NotebookRunAllCells]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.NotebookRunSelectedCell]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.NotebookAddCellBelow]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.RenderComplete]: Helpers.defaultReducer,
        // [InteractiveWindowMessages.FocusedCellEditor]: Helpers.defaultReducer
    });
}

export function createStore(skipDefault: boolean, baseTheme: string) {
    // Create a post office to listen to store dispatches and allow reducers to
    // send messages
    const postOffice = new PostOffice();

    // Send this into the root reducer
    const store = createAsyncStore<IMainState, QueuableAction<INativeEditorActionMapping>>(
        generateRootReducer(skipDefault, baseTheme, postOffice));

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
