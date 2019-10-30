// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

import { IMainState } from '../../interactive-common/mainState';
import { NativeEditorActions } from '../actions';

export namespace Focus {
    export function focusCell(prevState: IMainState, action: NativeEditorActions): IMainState {
        const newVMs = [...prevState.cellVMs];

        // Focus one cell and unfocus another
        const addFocusIndex = prevState.cellVMs.findIndex(c => c.cell.id === action.cellId);
        const removeFocusIndex = prevState.cellVMs.findIndex(c => c.cell.id === prevState.focusedCellId);
        if (addFocusIndex >= 0) {
            newVMs[addFocusIndex] = { ...newVMs[addFocusIndex], focused: true };
        }
        if (removeFocusIndex >= 0) {
            newVMs[removeFocusIndex] = { ...newVMs[removeFocusIndex], focused: false };
        }
        return {
            ...prevState,
            cellVMs: newVMs,
            focusedCellId: action.cellId
        };
    }
}
