// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

import { Action } from 'redux';
import { QueuableAction } from '../react-common/reduxUtils';
import { CursorPos } from '../interactive-common/mainState';

export const INSERT_ABOVE = 'insert_above';
export const INSERT_ABOVE_FIRST = 'insert_above_first';
export const FOCUS_CELL = 'focus_cell';

export interface IInsertAbove {
    type: typeof INSERT_ABOVE;
    cellId: string | undefined;
}

export interface IFocusCell {
    type: typeof FOCUS_CELL;
    cellId: string | undefined;
    cursorPos: CursorPos;
}

export type NativeEditorActionTypes = typeof INSERT_ABOVE | typeof INSERT_ABOVE_FIRST | typeof FOCUS_CELL;
export type NativeEditorActions = Partial<IInsertAbove> & Partial<IFocusCell> & QueuableAction;

// See https://react-redux.js.org/using-react-redux/connect-mapdispatch#defining-mapdispatchtoprops-as-an-object
export const actionCreators = {
    insertAbove: (cellId: string | undefined): IInsertAbove => ({ type: INSERT_ABOVE, cellId }),
    insertAboveFirst: (): Action => ({ type: INSERT_ABOVE_FIRST }),
    focusCell: (cellId: string, cursorPos: CursorPos = CursorPos.Current): IFocusCell => ({ type: FOCUS_CELL, cellId, cursorPos })
};
