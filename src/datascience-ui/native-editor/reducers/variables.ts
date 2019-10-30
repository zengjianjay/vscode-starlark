// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';
import { InteractiveWindowMessages } from '../../../client/datascience/interactive-common/interactiveWindowTypes';
import { IMainState } from '../../interactive-common/mainState';
import { NativeEditorActions } from '../actions';
import { Helpers } from './helpers';

export namespace Variables {

    export function refreshVariables(prevState: IMainState, action: NativeEditorActions): IMainState {
        Helpers.postMessage(prevState, InteractiveWindowMessages.GetVariablesRequest, action.newExecutionCount === undefined ? prevState.currentExecutionCount : action.newExecutionCount);
        return prevState;
    }

    export function toggleVariableExplorer(prevState: IMainState, action: NativeEditorActions): IMainState {
        const newState: IMainState = {
            ...prevState,
            variablesVisible: !prevState.variablesVisible
        };

        Helpers.postMessage(newState, InteractiveWindowMessages.VariableExplorerToggle, newState.variablesVisible);

        // If going visible for the first time, refresh our variables
        if (newState.variablesVisible) {
            return refreshVariables(newState, action);
        } else {
            return newState;
        }
    }
}
