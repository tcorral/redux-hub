import { IStateNode } from './hub-model';
interface INodeApiPipe<State, Dispatchers, model, result> {
    set: SetMethod<State, Dispatchers, model, result>;
}
export interface INodeApiComplete<State, Dispatchers, model, result> extends INodeApiPipe<State, Dispatchers, model, result> {
    create: () => IStateNode<State, Dispatchers>;
}
declare type SetMethod<State, Dispatchers, model, result> = <method extends Exclude<keyof model, keyof result>>(method: method, ...args: any[]) => INodeApiComplete<State, Dispatchers, model, result & {
    [x in method]: model[x];
}>;
export declare class NodeBuilder<State, Dispatchers, model, result> {
    node: (scopeName?: string) => INodeApiComplete<State, Dispatchers, model, result>;
}
export {};
