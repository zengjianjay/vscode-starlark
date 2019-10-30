// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

import { IMainState } from '../../interactive-common/mainState';
import { NativeEditorActions } from '../actions';

export namespace Cells {
    export function insertAbove(prevState: IMainState, action: NativeEditorActions): IMainState {
        // Find the position where we want to insert
        const position = prevState.cellVMs.findIndex(c => c.cell.id === action.cellId);
        if (cellAbove) {

        }

    }
}
