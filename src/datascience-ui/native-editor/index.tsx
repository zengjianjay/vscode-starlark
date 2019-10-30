// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';
import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { IVsCodeApi, PostOffice } from '../react-common/postOffice';
import { detectBaseTheme } from '../react-common/themeDetector';
import { createStore } from './redux';
import { getConnectedNativeEditor } from './nativeEditor';

// This special function talks to vscode from a web panel
export declare function acquireVsCodeApi(): IVsCodeApi;
const baseTheme = detectBaseTheme();

// Create the post office to talk to VS code
const postOffice = new PostOffice();

// Create the redux store
const store = createStore(
    // tslint:disable-next-line: no-typeof-undefined
    typeof acquireVsCodeApi !== 'undefined',
    baseTheme,
    postOffice);

// Wire up a connected react control for our NativeEditor
const ConnectedNativeEditor = getConnectedNativeEditor();

// Stick them all together
// tslint:disable:no-typeof-undefined
ReactDOM.render(
    <Provider store={store}>
        <ConnectedNativeEditor sendMessage={postOffice.sendMessage}/>
    </Provider>,
  document.getElementById('root') as HTMLElement
);
