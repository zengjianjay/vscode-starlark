// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';
import { IInteractiveWindowMapping } from '../../../client/datascience/interactive-common/interactiveWindowTypes';
import { IMainState } from '../../interactive-common/mainState';

export namespace Helpers {
    export function postMessage<M extends IInteractiveWindowMapping, T extends keyof M>(state: IMainState, type: T, payload?: M[T]) {
        setTimeout(() => state.sendMessage<M, T>(type, payload));
    }
}
