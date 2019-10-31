// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';
import * as uuid from 'uuid/v4';

import { ICell } from '../../../../client/datascience/types';
import {
    createCellVM,
    createEmptyCell,
    extractInputText,
    ICellViewModel,
    IMainState
} from '../../../interactive-common/mainState';
import { getSettings } from '../../../react-common/settingsReactSide';
import { actionCreators, QueueAnotherFunc, ICellAction } from '../actions';

export namespace Creation {
    function prepareCellVM(cell: ICell): ICellViewModel {
        const cellVM: ICellViewModel = createCellVM(cell, getSettings(), true);

        // Set initial cell visibility and collapse
        cellVM.editable = true;

        // Always have the cell input text open
        const newText = extractInputText(cellVM.cell, getSettings());

        cellVM.inputBlockOpen = true;
        cellVM.inputBlockText = newText;

        return cellVM;
    }

    export function insertAbove(prevState: IMainState, payload: ICellAction, queueAnother: QueueAnotherFunc): IMainState {
        const newVM = prepareCellVM(createEmptyCell(uuid(), null));
        const newList = [...prevState.cellVMs];

        // Find the position where we want to insert
        const position = prevState.cellVMs.findIndex(c => c.cell.id === payload.cellId);
        if (position >= 0) {
            newList.splice(position, 0, newVM);
        } else {
            newList.push(newVM);
        }

        const result = {
            ...prevState,
            cellVMs: newList
        };

        // Queue up an action to set focus to the cell we're inserting
        setTimeout(() => {
            queueAnother(actionCreators.focusCell(newVM.cell.id));
        });

        return result;
    }

    export function insertBelow(prevState: IMainState, payload: ICellAction, queueAnother: QueueAnotherFunc): IMainState {
        const newVM = prepareCellVM(createEmptyCell(uuid(), null));
        const newList = [...prevState.cellVMs];

        // Find the position where we want to insert
        const position = prevState.cellVMs.findIndex(c => c.cell.id === payload.cellId);
        if (position >= 0) {
            newList.splice(position + 1, 0, newVM);
        } else {
            newList.push(newVM);
        }

        const result = {
            ...prevState,
            cellVMs: newList
        };

        // Queue up an action to set focus to the cell we're inserting
        setTimeout(() => {
            queueAnother(actionCreators.focusCell(newVM.cell.id));
        });

        return result;
    }

    export function insertAboveFirst(prevState: IMainState, _a: undefined, queueAnother: QueueAnotherFunc): IMainState {
        // Get the first cell id
        const firstCellId = prevState.cellVMs.length > 0 ? prevState.cellVMs[0].cell.id : undefined;

        // Do what an insertAbove does
        return insertAbove(prevState, { cellId: firstCellId }, queueAnother);
    }

    export function addNewCell(prevState: IMainState, _a: undefined, queueAnother: QueueAnotherFunc): IMainState {
        // Do the same thing that an insertBelow does using the currently selected cell.
        return insertBelow(prevState, { cellId: prevState.selectedCellId }, queueAnother);
    }

}
