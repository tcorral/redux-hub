import { Unsubscribe } from 'redux';
export interface IActionCreators {
    [name: string]: any;
}
export interface IActions {
    [name: string]: any;
}
export interface ICombines {
    [name: string]: any;
}
export interface IReducers {
    [name: string]: any;
}
export interface IStateHolder<STATE> {
    previous: STATE | any;
    current?: STATE | any;
}
export declare type Listener = (...args: any[]) => void;
export declare type Subscribe = (listener?: Listener) => Unsubscribe;
export interface INodeStore<State, Dispatchers, Subscribers> {
    dispatchers: Dispatchers;
    getState: () => State;
    subscribeToEvent: (eventType: keyof Subscribers, ...listeners: Listener[]) => Unsubscribe | void;
}
export interface IStateNode<State, Dispatchers> {
    dispatchers: Dispatchers;
    getState(): State;
    createSubscriber(config?: {
        handler?: (stateHolder: IStateHolder<State>, listener: Listener) => any;
        stateSelector?: ((state: State) => any) | undefined;
    }): Subscribe;
}
export interface IStateHub {
    createNode<State, Dispatchers>(config: {
        name: string;
        reducers: IReducers;
        actionCreators?: IActionCreators;
        initialState?: State;
    }): IStateNode<State, Dispatchers>;
}
export declare const stateHub: IStateHub;
