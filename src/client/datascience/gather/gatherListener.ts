import { inject, injectable } from 'inversify';
import { Event, EventEmitter } from 'vscode';
import { noop } from '../../common/utils/misc';
import { InteractiveWindowMessages } from '../interactive-common/interactiveWindowTypes';
import { IGatherExecution, IInteractiveWindowListener, INotebook } from '../types';

@injectable()
export class GatherListener implements IInteractiveWindowListener {
    // tslint:disable-next-line: no-any
    private postEmitter: EventEmitter<{ message: string; payload: any }> = new EventEmitter<{ message: string; payload: any }>();

    constructor(
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
            case InteractiveWindowMessages.ConnectedToNotebook:
                const nb = payload as INotebook;
                if (nb) {
                    void nb.addGatherSupport(this.gatherExecution);
                }
                break;

            default:
                break;
        }
    }
}
