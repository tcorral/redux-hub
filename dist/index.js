"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var loggerMiddleware = function (mainStore) { return function (next) { return function (action) {
    /* tslint:disable */
    console.group(action.type);
    console.info('dispatching', action);
    var result = next(action);
    console.log('next state', mainStore.getState());
    console.groupEnd();
    /* tslint:enable */
    return result;
}; }; };
var reducers = {};
var combines = {};
var store = redux_1.createStore(reducerResolver, {} /*, applyMiddleware(loggerMiddleware)*/);
function reducerResolver(state, action) {
    if (state === void 0) { state = {}; }
    var hasChanged = false;
    var nextState = {};
    var combinesKeys = Object.keys(combines);
    combinesKeys.forEach(function (key) {
        var reducer = combines[key];
        var oldState = state[key];
        var newState = reducer(oldState, action);
        hasChanged = hasChanged || oldState !== newState;
        nextState[key] = newState;
    });
    return hasChanged ? nextState : state;
}
var defineReducer = function (scope) {
    combines[scope] = function (state, action) {
        var scopeReducers = reducers[scope];
        var reducer = function (red) {
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
var createDispatchers = function (actionCreators) {
    return Object.keys(actionCreators).reduce(function (dispatchers, action) {
        var _a;
        return (__assign({}, dispatchers, (_a = {}, _a[action] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return store.dispatch(actionCreators[action].apply(actionCreators, args));
        }, _a)));
    }, {});
};
var addReducers = function (initialReducers, scope, defaultState) {
    if (combines[scope] === undefined) {
        defineReducer(scope);
    }
    var scopeReducers = reducers[scope] || {};
    var reducersKeys = Object.keys(initialReducers);
    reducersKeys.forEach(function (type) {
        var reducer = initialReducers[type];
        if (typeof reducer === 'function') {
            scopeReducers[type] = [reducer];
        }
        else {
            scopeReducers[type].push(reducer);
        }
    });
    if (defaultState !== undefined) {
        scopeReducers._default = defaultState;
    }
    reducers[scope] = scopeReducers;
};
exports.stateHub = {
    createNode: function (config) {
        var scope = config.name;
        var actionCreators = config.actionCreators;
        var initialState = config.initialState || {};
        var getDispatchers = function () {
            if (actionCreators) {
                return createDispatchers(actionCreators);
            }
            return {};
        };
        var publicApi = {
            getState: function () {
                return store.getState()[scope];
            },
            dispatchers: getDispatchers(),
            createSubscriber: function (subscriberConfig) {
                return function (listener) {
                    var stateSelector;
                    var stateHolder;
                    if (subscriberConfig) {
                        stateSelector = function () {
                            var scopedState = store.getState()[scope];
                            return subscriberConfig.stateSelector ?
                                subscriberConfig.stateSelector(scopedState) :
                                scopedState;
                        };
                        stateHolder = {
                            previous: stateSelector(),
                        };
                    }
                    return store.subscribe(function () {
                        if (subscriberConfig) {
                            stateHolder.current = stateSelector();
                            if (subscriberConfig.stateSelector && (stateHolder.previous === stateHolder.current)) {
                                return;
                            }
                            if (subscriberConfig.handler) {
                                subscriberConfig.handler(stateHolder, listener);
                            }
                            else if (!subscriberConfig.handler && typeof listener === 'function') {
                                listener();
                            }
                            stateHolder.previous = stateHolder.current;
                        }
                        else if (typeof listener === 'function') {
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
