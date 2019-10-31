// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';
import { Action } from 'redux';

import { CursorPos, IMainState } from '../../interactive-common/mainState';
import { QueuableAction } from '../../react-common/reduxUtils';
import { InteractiveWindowMessages, IInteractiveWindowMapping } from '../../../client/datascience/interactive-common/interactiveWindowTypes';

export enum NativeEditorActionTypes {

    INSERT_ABOVE = 'insert_above',
    INSERT_BELOW = 'insert_below',
    INSERT_ABOVE_FIRST = 'insert_above_first',
    FOCUS_CELL = 'focus_cell',
    ADD_NEW_CELL = 'add_new_cell',
    EXECUTE_CELL = 'execute_cell',
    EXECUTE_ALL_CELLS = 'execute_all_cells',
    TOGGLE_VARIABLE_EXPLORER = 'toggle_variable_explorer',
    REFRESH_VARIABLES = 'refresh_variables'
}

export interface ICellAction {
    cellId: string | undefined;
}

export interface IFocusCell {
    cellId: string | undefined;
    cursorPos: CursorPos;
}

export interface IExecuteAction extends ICellAction {
    code: string;
}

export interface IExecuteAllAction {
    codes: string[];
}

export interface IRefreshVariablesAction {
    newExecutionCount?: number;
}

type KeyedAction = Action<NativeEditorActionTypes>;
export type QueueAnotherFunc = (nextAction: KeyedAction) => void;
type ActionFunc<T> = T extends null | undefined ?
    (prevState: IMainState, queueAnother: QueueAnotherFunc) => IMainState :
    (prevState: IMainState, args: T, queueAnother: QueueAnotherFunc) => IMainState;

export class INativeEditorActionMapping {
    public [NativeEditorActionTypes.INSERT_ABOVE]: ActionFunc<ICellAction>;
    public [NativeEditorActionTypes.INSERT_BELOW]: ActionFunc<ICellAction>;
    public [NativeEditorActionTypes.INSERT_ABOVE_FIRST]: ActionFunc<never | undefined>;
    public [NativeEditorActionTypes.FOCUS_CELL]: ActionFunc<ICellAction>;
    public [NativeEditorActionTypes.ADD_NEW_CELL]: ActionFunc<never | undefined>;
    public [NativeEditorActionTypes.EXECUTE_CELL]: ActionFunc<ICellAction>;
    public [NativeEditorActionTypes.EXECUTE_ALL_CELLS]: ActionFunc<never | undefined>;
    public [NativeEditorActionTypes.TOGGLE_VARIABLE_EXPLORER]: ActionFunc<never | undefined>;
    public [NativeEditorActionTypes.REFRESH_VARIABLES]: ActionFunc<IRefreshVariablesAction>;
}


// See https://react-redux.js.org/using-react-redux/connect-mapdispatch#defining-mapdispatchtoprops-as-an-object
export const actionCreators = {
    insertAbove: (cellId: string | undefined): KeyedAction & ICellAction => ({ type: NativeEditorActionTypes.INSERT_ABOVE, cellId }),
    insertAboveFirst: (): KeyedAction => ({ type: NativeEditorActionTypes.INSERT_ABOVE_FIRST }),
    insertBelow: (cellId: string | undefined): KeyedAction & ICellAction => ({ type: NativeEditorActionTypes.INSERT_BELOW, cellId }),
    focusCell: (cellId: string, cursorPos: CursorPos = CursorPos.Current): KeyedAction & IFocusCell => ({ type: NativeEditorActionTypes.FOCUS_CELL, cellId, cursorPos }),
    addCell: (): KeyedAction => ({ type: NativeEditorActionTypes.ADD_NEW_CELL }),
    executeCell: (cellId: string, code: string): KeyedAction & IExecuteAction => ({ type: NativeEditorActionTypes.EXECUTE_CELL, cellId, code }),
    executeAllCells: (codes: string[]): KeyedAction & IExecuteAllAction => ({ type: NativeEditorActionTypes.EXECUTE_ALL_CELLS, codes }),
    toggleVariableExplorer: (): KeyedAction => ({ type: NativeEditorActionTypes.TOGGLE_VARIABLE_EXPLORER }),
    refreshVariables: (newExecutionCount?: number): KeyedAction & IRefreshVariablesAction => ({ type: NativeEditorActionTypes.REFRESH_VARIABLES, newExecutionCount })
};
