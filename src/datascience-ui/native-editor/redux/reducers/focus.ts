// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

import { IMainState } from '../../../interactive-common/mainState';
import { ICellAction } from '../actions';

export namespace Focus {
    export function focusCell(prevState: IMainState, payload: ICellAction): IMainState {
        const newVMs = [...prevState.cellVMs];

        // Focus one cell and unfocus another. Focus should always gain selection too.
        const addFocusIndex = prevState.cellVMs.findIndex(c => c.cell.id === payload.cellId);
        let removeFocusIndex = prevState.cellVMs.findIndex(c => c.cell.id === prevState.focusedCellId);
        if (removeFocusIndex < 0) {
            removeFocusIndex = prevState.cellVMs.findIndex(c => c.cell.id === prevState.selectedCellId);
        }
        if (addFocusIndex >= 0) {
            newVMs[addFocusIndex] = { ...newVMs[addFocusIndex], focused: true, selected: true };
        }
        if (removeFocusIndex >= 0) {
            newVMs[removeFocusIndex] = { ...newVMs[removeFocusIndex], focused: false, selected: false };
        }
        return {
            ...prevState,
            cellVMs: newVMs,
            focusedCellId: payload.cellId,
            selectedCellId: payload.cellId
        };
    }

    export function unfocusCell(prevState: IMainState): IMainState {
        const newVMs = [...prevState.cellVMs];

        // Unfocus the currently focused cell.
        const removeFocusIndex = prevState.cellVMs.findIndex(c => c.cell.id === prevState.focusedCellId);
        if (removeFocusIndex >= 0) {
            newVMs[removeFocusIndex] = { ...newVMs[removeFocusIndex], focused: false };
        }
        return {
            ...prevState,
            cellVMs: newVMs,
            focusedCellId: undefined
        };
    }
}
