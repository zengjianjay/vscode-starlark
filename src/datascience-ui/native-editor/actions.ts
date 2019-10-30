// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';
import { Action } from 'redux';

import { CursorPos } from '../interactive-common/mainState';
import { QueuableAction } from '../react-common/reduxUtils';

export const INSERT_ABOVE = 'insert_above';
export const INSERT_BELOW = 'insert_below';
export const INSERT_ABOVE_FIRST = 'insert_above_first';
export const FOCUS_CELL = 'focus_cell';
export const ADD_CELL = 'add_cell';
export const EXECUTE_CELL = 'execute_cell';
export const EXECUTE_ALL_CELLS = 'execute_all_cells';

export interface ICellAction {
    type: typeof INSERT_ABOVE | typeof INSERT_BELOW | typeof EXECUTE_CELL;
    cellId: string | undefined;
}

export interface IFocusCell {
    type: typeof FOCUS_CELL;
    cellId: string | undefined;
    cursorPos: CursorPos;
}

export interface IExecuteAction extends ICellAction {
    code: string;
}

export interface IExecuteAllAction {
    type: typeof EXECUTE_ALL_CELLS;
    codes: string[];
}

export type NativeEditorActionTypes = typeof INSERT_ABOVE | typeof INSERT_BELOW | typeof INSERT_ABOVE_FIRST | typeof FOCUS_CELL | typeof ADD_CELL | typeof EXECUTE_CELL | typeof EXECUTE_ALL_CELLS;
export type NativeEditorActions = Partial<IExecuteAction> & Partial<IExecuteAllAction> & Partial<ICellAction> & Partial<IFocusCell> & QueuableAction;

// See https://react-redux.js.org/using-react-redux/connect-mapdispatch#defining-mapdispatchtoprops-as-an-object
export const actionCreators = {
    insertAbove: (cellId: string | undefined): ICellAction => ({ type: INSERT_ABOVE, cellId }),
    insertAboveFirst: (): Action => ({ type: INSERT_ABOVE_FIRST }),
    insertBelow: (cellId: string | undefined): ICellAction => ({ type: INSERT_BELOW, cellId }),
    focusCell: (cellId: string, cursorPos: CursorPos = CursorPos.Current): IFocusCell => ({ type: FOCUS_CELL, cellId, cursorPos }),
    addCell: (): Action => ({ type: ADD_CELL }),
    executeCell: (cellId: string, code: string): IExecuteAction => ({ type: EXECUTE_CELL, cellId, code }),
    executeAllCells: (codes: string[]): IExecuteAllAction => ({ type: EXECUTE_ALL_CELLS, codes })
};
