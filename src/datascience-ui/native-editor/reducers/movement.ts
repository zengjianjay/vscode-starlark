// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

import { IMainState } from '../../interactive-common/mainState';
import { NativeEditorActions } from '../actions';
import { Cells } from './cells';


export namespace Movement {
    export function insertAboveFirst(prevState: IMainState, action: NativeEditorActions): IMainState {
        // Get the first cell id
        const firstCellId = prevState.cellVMs.length > 0 ? prevState.cellVMs[0].cell.id : undefined;

        // Do what a insertAbove does
        return Cells.insertAbove(prevState)


        const cellId = this.props.cellVMs.length > 0 ? this.props.cellVMs[0].cell.id : undefined;
        const newCell = this.props.insertAbove(cellId, true);
        if (newCell) {
            // Make async because the click changes focus.
            setTimeout(() => this.focusCell(newCell, true, CursorPos.Top), 0);
        }

        return prevState;
    }
}
