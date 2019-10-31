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
import { arePathsSame } from '../../../react-common/arePathsSame';
import { Variables } from './variables';

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

    function updateOrAdd(prevState: IMainState, cell: ICell): IMainState {
        // First compute new execution count.
        const newExecutionCount = cell.data.execution_count ?
            Math.max(prevState.currentExecutionCount, parseInt(cell.data.execution_count.toString(), 10)) :
            prevState.currentExecutionCount;
        if (newExecutionCount !== prevState.currentExecutionCount && prevState.variablesVisible) {
            // We also need to update our variable explorer when the execution count changes
            // Use the ref here to maintain var explorer independence
            Variables.refreshVariables(prevState, { newExecutionCount });
        }

        const index = prevState.cellVMs.findIndex((c: ICellViewModel) => {
            return c.cell.id === cell.id &&
                c.cell.line === cell.line &&
                arePathsSame(c.cell.file, cell.file);
        });
        if (index >= 0) {
            // This means the cell existed already so it was actual executed code.
            // Use its execution count to update our execution count.

            // Have to make a copy of the cell VM array or
            // we won't actually update.
            const newVMs = [...prevState.cellVMs];

            // Live share has been disabled for now, see https://github.com/microsoft/vscode-python/issues/7972
            // Check to see if our code still matches for the cell (in liveshare it might be updated from the other side)
            // if (concatMultilineStringInput(this.pendingState.cellVMs[index].cell.data.source) !== concatMultilineStringInput(cell.data.source)) {

            // If cell state changes, then update just the state and the cell data (excluding source).
            // Prevent updates to the source, as its possible we have recieved a response for a cell execution
            // and the user has updated the cell text since then.
            if (prevState.cellVMs[index].cell.state !== cell.state) {
                newVMs[index] = {
                    ...newVMs[index],
                    cell: {
                        ...newVMs[index].cell,
                        state: cell.state,
                        data: {
                            ...cell.data,
                            source: newVMs[index].cell.data.source
                        }
                    }
                };
            } else {
                newVMs[index] = { ...newVMs[index], cell: cell };
            }

            return {
                ...prevState,
                cellVMs: newVMs,
                currentExecutionCount: newExecutionCount
            };
        } else {
            // This is an entirely new cell (it may have started out as finished)
            const newVM = prepareCellVM(cell);
            const newVMs = [
                ...prevState.cellVMs,
                newVM];
            return {
                ...prevState,
                cellVMs: newVMs,
                currentExecutionCount: newExecutionCount
            };
        }
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

    export function insertAboveFirst(prevState: IMainState, queueAnother: QueueAnotherFunc): IMainState {
        // Get the first cell id
        const firstCellId = prevState.cellVMs.length > 0 ? prevState.cellVMs[0].cell.id : undefined;

        // Do what an insertAbove does
        return insertAbove(prevState, { cellId: firstCellId }, queueAnother);
    }

    export function addNewCell(prevState: IMainState, queueAnother: QueueAnotherFunc): IMainState {
        // Do the same thing that an insertBelow does using the currently selected cell.
        return insertBelow(prevState, { cellId: prevState.selectedCellId }, queueAnother);
    }

    export function startCell(prevState: IMainState, cell: ICell): IMainState {
        return updateOrAdd(prevState, cell);
    }

    export function updateCell(prevState: IMainState, cell: ICell): IMainState {
        return updateOrAdd(prevState, cell);
    }

    export function finishCell(prevState: IMainState, cell: ICell): IMainState {
        return updateOrAdd(prevState, cell);
    }

}
