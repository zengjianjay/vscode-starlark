// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

import { Action } from 'redux';
import { QueuableAction } from '../react-common/reduxUtils';

export const INSERT_ABOVE = 'insert_above';
export const INSERT_ABOVE_FIRST = 'insert_above_first';

export interface IInsertAbove {
    type: typeof INSERT_ABOVE;
    cellId: string | undefined;
}

export type NativeEditorActionTypes = typeof INSERT_ABOVE | typeof INSERT_ABOVE_FIRST;
export type NativeEditorActions = IInsertAbove & QueuableAction;

const insertAbove = (cellId: string | undefined): IInsertAbove => ({ type: INSERT_ABOVE, cellId });
const insertAboveFirst = (): Action => ({ type: INSERT_ABOVE_FIRST });

// See https://react-redux.js.org/using-react-redux/connect-mapdispatch#defining-mapdispatchtoprops-as-an-object
export const actionCreators = {
    insertAbove,
    insertAboveFirst
};
