import { AnyAction, applyMiddleware, createStore, Middleware, Reducer, Store, Unsubscribe } from 'redux';

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
export type Listener = (...args: any[]) => void;
export type Subscribe = (listener?: Listener) => Unsubscribe;

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

const loggerMiddleware: Middleware = (mainStore) => (next) => (action) => {
    /* tslint:disable */
    console.group(action.type);
    console.info('dispatching', action);
    const result = next(action);
    console.log('next state', mainStore.getState());
    console.groupEnd();
    /* tslint:enable */
    return result;
};

const reducers: IReducers = {};
const combines: ICombines = {};

const store: Store<any> = createStore(reducerResolver, {}/*, applyMiddleware(loggerMiddleware)*/);

function reducerResolver(state: any = {}, action: AnyAction): any {
    let hasChanged = false;
    const nextState: any = {};
    const combinesKeys = Object.keys(combines);
    combinesKeys.forEach((key: string) => {
        const reducer = combines[key];
        const oldState = state[key];
        const newState = reducer(oldState, action);
        hasChanged = hasChanged || oldState !== newState;
        nextState[key] = newState;
    });
    return hasChanged ? nextState : state;
}

const defineReducer = (scope: string): void => {
    combines[scope] = (state: any, action: AnyAction) => {
        const scopeReducers = reducers[scope];
        const reducer = (red: Reducer<any>) => {
            state = red(state, action);
        };
        if (scopeReducers.all !== undefined) {
            scopeReducers.all.map(reducer);
        }
        if (scopeReducers[action.type] !== undefined) {
            scopeReducers[action.type].map(reducer);
        }
        return state === undefined ?
            (scopeReducers._default === undefined ? {} : scopeReducers._default) :
            state;
    };
};

const  createDispatchers = <Dispatchers>(actionCreators: { [key: string]: any }): Dispatchers => {
    return Object.keys(actionCreators).reduce((dispatchers: object, action) => ({
        ...dispatchers,
        [action]: (...args: any[]): Subscribe => store.dispatch(actionCreators[action](...args)),
    }), {}) as Dispatchers;
};

const addReducers = (initialReducers: IReducers, scope: string, defaultState?: any): void => {
    if (combines[scope] === undefined) {
        defineReducer(scope);
    }
    const scopeReducers: IReducers = reducers[scope] || {};
    const reducersKeys = Object.keys(initialReducers);
    reducersKeys.forEach((type: string) => {
        const reducer: Reducer<any> = initialReducers[type];
        if (typeof reducer === 'function') {
            scopeReducers[type] = [ reducer ];
        } else {
            scopeReducers[type].push(reducer);
        }
    });
    if (defaultState !== undefined) {
        scopeReducers._default = defaultState;
    }
    reducers[scope] = scopeReducers;
};

export const stateHub: IStateHub = {
    createNode<State, Dispatchers>(config: {
        name: string,
        reducers: IReducers,
        actionCreators?: IActionCreators,
        initialState?: State,
    }): IStateNode<State, Dispatchers> {
        const scope = config.name;
        const actionCreators = config.actionCreators;
        const initialState = config.initialState || {};
        const  getDispatchers = (): Dispatchers => {
            if (actionCreators) {
                return createDispatchers<Dispatchers>(actionCreators);
            }
            return ({} as Dispatchers);
        };
        const publicApi = {
            getState() {
                return store.getState()[scope];
            },
            dispatchers: getDispatchers(),
            createSubscriber(subscriberConfig: {
                handler?: (stateHolder: IStateHolder<State>, listener?: Listener) => any,
                stateSelector?: (state: State) => State | any,
            }): Subscribe {
                return (listener?: Listener): Unsubscribe => {
                    let stateSelector: () => State | any;
                    let stateHolder: IStateHolder<State>;
                    if (subscriberConfig) {
                        stateSelector = (): State | any => {
                            const scopedState = store.getState()[scope] as State;
                            return subscriberConfig.stateSelector ?
                                    subscriberConfig.stateSelector(scopedState) :
                                    scopedState;
                        };
                        stateHolder = {
                            previous: stateSelector(),
                        };
                    }

                    return store.subscribe(() => {
                        if (subscriberConfig) {
                            stateHolder.current = stateSelector();
                            if (subscriberConfig.stateSelector && (stateHolder.previous === stateHolder.current)) {
                                return;
                            }

                            if (subscriberConfig.handler) {
                                subscriberConfig.handler(stateHolder, listener);
                            } else if (!subscriberConfig.handler && typeof listener === 'function') {
                                listener();
                            }
                            stateHolder.previous = stateHolder.current;
                        } else if (typeof listener === 'function') {
                            listener();
                        }
                    });
                };
            },
        };

        addReducers(config.reducers, scope, initialState);

        store.dispatch({
            type: '1n1t14l1z3',
        });

        return publicApi;
    },
};
