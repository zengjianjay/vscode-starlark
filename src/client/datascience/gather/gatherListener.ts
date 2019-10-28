import { inject, injectable } from 'inversify';
import * as uuid from 'uuid/v4';
import { Event, EventEmitter } from 'vscode';
import { IApplicationShell } from '../../common/application/types';
import * as localize from '../../common/utils/localize';
import { noop } from '../../common/utils/misc';
import { generateCellsFromString } from '../cellFactory';
import { InteractiveWindowMessages } from '../interactive-common/interactiveWindowTypes';
import { ICell, IGatherExecution, IInteractiveWindowListener, INotebookEditorProvider, INotebookExporter } from '../types';

@injectable()
export class GatherListener implements IInteractiveWindowListener {
    // tslint:disable-next-line: no-any
    private postEmitter: EventEmitter<{ message: string; payload: any }> = new EventEmitter<{ message: string; payload: any }>();

    constructor(
        @inject(INotebookExporter) private jupyterExporter: INotebookExporter,
        @inject(INotebookEditorProvider) private ipynbProvider: INotebookEditorProvider,
        @inject(IApplicationShell) private applicationShell: IApplicationShell,
        @inject(IGatherExecution) private gatherExecution: IGatherExecution) { }

    public dispose() {
        noop();
    }

    // tslint:disable-next-line: no-any
    public get postMessage(): Event<{ message: string; payload: any }> {
        return this.postEmitter.event;
    }

    // tslint:disable-next-line: no-any
    public onMessage(message: string, payload?: any): void {
        switch (message) {
            case InteractiveWindowMessages.GatherCode:
                if (payload) {
                    const cell = payload as ICell;
                    this.gatherCode(cell);
                }
                break;

            case InteractiveWindowMessages.RestartKernel:
                this.gatherExecution.resetLog();
                break;

            default:
                break;
        }
    }

    public gatherCode(payload: ICell) {
        this.gatherCodeInternal(payload).catch(err => {
            this.applicationShell.showErrorMessage(err);
        });
    }

    private gatherCodeInternal = async (cell: ICell) => {
        const slicedProgram = this.gatherExecution.gatherCode(cell);
        const newuri = await this.ipynbProvider.getNextNewNotebookUri();

        let cells: ICell[] = [{
            id: uuid(),
            file: '',
            line: 0,
            state: 0,
            executedInCurrentKernel: false,
            data: {
                cell_type: 'markdown',
                source: localize.DataScience.gatheredNotebookDescriptionInMarkdown(),
                metadata: {}
            }
        }];

        // Create new notebook with the returned program and open it.
        cells = cells.concat(generateCellsFromString(slicedProgram));

        const notebook = await this.jupyterExporter.translateToNotebook(cells);
        const contents = JSON.stringify(notebook);

        await this.ipynbProvider.open(newuri, contents);
    }
}
