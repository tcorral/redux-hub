import { Unsubscribe } from 'redux';
export interface IReducers {
    [name: string]: any;
}
export interface IStateHolder<STATE> {
    previous: STATE | any;
    current?: STATE | any;
}
export declare type Listener = (...args: any[]) => void;
export declare type Subscribe = (listener?: Listener) => Unsubscribe;
export interface IActionCreators {
    [name: string]: any;
}
export interface IStateNode<State, Dispatchers> {
    dispatchers: Dispatchers;
    getState(): State;
    createSubscriber(config?: {
        handler?: (stateHolder: IStateHolder<State>, listener: Listener) => any;
        stateSelector?: ((state: State) => any) | undefined;
    }): Subscribe;
}
export interface IState {
    [name: string]: any;
}
export interface IActions {
    [name: string]: any;
}
export interface ICombines {
    [name: string]: any;
}
export declare type Hub = {
    reducers(oReducers: IReducers): HubModel;
    actions<Dispatchers>(actionCreators: IActionCreators): HubModel;
    state<State>(initialState: State): HubModel;
};
export declare class HubModel {
    private scopeName;
    constructor(scopeName: string);
    reducers(oReducers: IReducers): HubModel;
    actions<Dispatchers>(actionCreators: IActionCreators): HubModel;
    state<State>(initialState: State): HubModel;
    create<State, Dispatchers>(): IStateNode<State, Dispatchers>;
}
