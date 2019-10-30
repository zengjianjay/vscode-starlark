// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';
import { CellMatcher } from '../../../client/datascience/cellMatcher';
import { concatMultilineStringInput } from '../../../client/datascience/common';
import { InteractiveWindowMessages } from '../../../client/datascience/interactive-common/interactiveWindowTypes';
import { CellState } from '../../../client/datascience/types';
import { IMainState } from '../../interactive-common/mainState';
import { getSettings } from '../../react-common/settingsReactSide';
import { NativeEditorActions } from '../actions';
import { Helpers } from './helpers';

export namespace Execution {
    function modifyStateForCellExecute(prevState: IMainState, index: number, code: string | undefined): IMainState {
        if (index >= 0 && index < prevState.cellVMs.length) {
            const vm = prevState.cellVMs[index];
            // noop if the submitted code is just a cell marker
            const matcher = new CellMatcher(getSettings());
            if (code && matcher.stripFirstMarker(code).length > 0) {
                const newVMs = [...prevState.cellVMs];

                if (vm.cell.data.cell_type === 'code') {
                    // Update our input cell to be in progress again and clear outputs
                    newVMs[index] = { ...vm, inputBlockText: code, cell: { ...vm.cell, state: CellState.executing, data: { ...vm.cell.data, source: code, outputs: [] } } };
                } else {
                    // Update our input to be our new code
                    newVMs[index] = { ...vm, inputBlockText: code, cell: { ...vm.cell, data: { ...vm.cell.data, source: code } } };
                }
                return {
                    ...prevState,
                    cellVMs: newVMs
                };
            }
        }

        return prevState;
    }

    export function executeCell(prevState: IMainState, action: NativeEditorActions): IMainState {
        const index = prevState.cellVMs.findIndex(c => c.cell.id === action.cellId);

        // Generate a new state based on the cell type.
        const newState = modifyStateForCellExecute(prevState, index, action.code);

        // Post a message to the other side to reexecute
        if (action.cellId && action.code) {
            Helpers.postMessage(newState, InteractiveWindowMessages.ReExecuteCell, { code: action.code, id: action.cellId });
        }

        return prevState;
    }

    export function executeAllCells(prevState: IMainState, action: NativeEditorActions): IMainState {
        // Go through all cells and reexecute them. We only want a single state update though.
        if (action.codes && action.codes.length) {
            const result = action.codes.reduce<IMainState>((p, c, i) => modifyStateForCellExecute(p, i, c), prevState);

            // However we want to send a message for each
            result.cellVMs.filter(c => c.cell.data.cell_type === 'code').forEach(
                vm => Helpers.postMessage(
                    result,
                    InteractiveWindowMessages.ReExecuteCell,
                    { code: concatMultilineStringInput(vm.cell.data.source), id: vm.cell.id }));

            return result;
        }

        return prevState;
    }

}
