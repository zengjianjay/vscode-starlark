// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';
import { InteractiveWindowMessages } from '../../../../client/datascience/interactive-common/interactiveWindowTypes';
import { IMainState } from '../../../interactive-common/mainState';
import { IRefreshVariablesAction } from '../actions';
import { Helpers } from './helpers';

export namespace Variables {

    export function refreshVariables(prevState: IMainState, payload: IRefreshVariablesAction): IMainState {
        Helpers.postMessage(prevState, InteractiveWindowMessages.GetVariablesRequest,
            payload.newExecutionCount === undefined ? prevState.currentExecutionCount : payload.newExecutionCount);
        return prevState;
    }

    export function toggleVariableExplorer(prevState: IMainState): IMainState {
        const newState: IMainState = {
            ...prevState,
            variablesVisible: !prevState.variablesVisible
        };

        Helpers.postMessage(newState, InteractiveWindowMessages.VariableExplorerToggle, newState.variablesVisible);

        // If going visible for the first time, refresh our variables
        if (newState.variablesVisible) {
            return refreshVariables(newState, { newExecutionCount: undefined });
        } else {
            return newState;
        }
    }
}
