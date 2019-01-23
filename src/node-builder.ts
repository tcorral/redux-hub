// @ts-ignore
import * as uuidv4 from 'uuid/v4';

import { Hub, HubModel, IStateNode } from './hub-model';

interface INodeApiPipe<State, Dispatchers, model, result> {
    set: SetMethod<State, Dispatchers, model, result>;
}
export interface INodeApiComplete<State, Dispatchers, model, result>
extends INodeApiPipe<State, Dispatchers, model, result> {
    create: () => IStateNode<State, Dispatchers>;
}

type SetMethod<State, Dispatchers, model, result> =
    <method extends Exclude<keyof model, keyof result>>(method: method, ...args: any[]) =>
    INodeApiComplete<State, Dispatchers, model, result & { [x in method]: model[x] }>;

export class NodeBuilder<State, Dispatchers, model, result> {
    public node = (scopeName: string = uuidv4()): INodeApiComplete<State, Dispatchers, model, result> => {
        const hubModel: HubModel = new HubModel(scopeName);
        const executionTrack: { [key in keyof Hub]?: boolean } = {};

        const create = () => {
            if (!executionTrack.actions || !executionTrack.reducers) {
                throw new Error('Unable to create node. Actions and reducers are required.');
            }
            if (!executionTrack.state) {
                hubModel.state({});
            }
            return hubModel.create<State, Dispatchers>();
        };

        const set: SetMethod<State, Dispatchers, model, result> =
            <method extends Exclude<keyof model, keyof result>>(method: method, data: any, hook: (data: any) => any):
                INodeApiComplete<State, Dispatchers, model, result  & { [x in method]: model[x] }>  => {
                    (executionTrack as any)[method] = true;
                    if (typeof hook === 'function') {
                        data = hook(data);
                    }
                    (hubModel as any)[method](data);
                    return {
                        create,
                        set,
                    };
            };

        return {
            create,
            set,
        };
    }
}
