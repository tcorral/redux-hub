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
var index_1 = require("./index");
describe('redux-hub', function () {
    describe('StateHub', function () {
        it('should exist StateHub', function () {
            expect(index_1.StateHub).toBeDefined();
        });
    });
    describe('public api', function () {
        var stateHub;
        beforeEach(function () {
            stateHub = new index_1.StateHub();
        });
        describe('#constructor', function () {
            it('should return an instance', function () {
                expect(stateHub.node).toBeDefined();
            });
        });
        describe('#node', function () {
            var node;
            beforeEach(function () {
                node = stateHub.node('test');
            });
            it('should return set and create api', function () {
                expect(node.set).toBeDefined();
                expect(node.create).toBeDefined();
            });
            describe('#set', function () {
                it('should return the set and create api', function () {
                    var api = node.set('actions', {});
                    expect(api.set).toBeDefined();
                    expect(api.create).toBeDefined();
                });
                /**
                 * This test is commented because it's preventing compiling but it's important
                 * to test that the TS exclusion on using property names is working.
                 *
                 * it('should not allow to set two times the same property', () => {
                 *     const api = node.set('actions');
                 *     api.set('actions');
                 * });
                 */
            });
            describe('#create', function () {
                it("should throw an error if we have not set actions\n                and reducers before using create method: nothing set", function () {
                    expect(function () {
                        node.create();
                    }).toThrow();
                });
                it("should throw an error if we have not set actions\n                and reducers before using create method: setting actions only", function () {
                    expect(function () {
                        node
                            .set('actions', {})
                            .create();
                    }).toThrow();
                });
                it("should throw an error if we have not set actions\n                and reducers before using create method: setting actions and state only", function () {
                    expect(function () {
                        node
                            .set('actions', {})
                            .set('state', {})
                            .create();
                    }).toThrow();
                });
                it("should throw an error if we have not set actions\n                and reducers before using create method: setting reducers only", function () {
                    expect(function () {
                        node
                            .set('reducers', {})
                            .create();
                    }).toThrow();
                });
                it("should throw an error if we have not set actions\n                and reducers before using create method: setting reducers and state only", function () {
                    expect(function () {
                        node
                            .set('reducers', {})
                            .set('state', {})
                            .create();
                    }).toThrow();
                });
                it("should create the state node if we have set actions\n                and reducers before using create method: no initial state", function () {
                    var stateNode = node
                        .set('reducers', {})
                        .set('actions', {})
                        .create();
                    expect(stateNode.createSubscriber).toBeDefined();
                    expect(stateNode.dispatchers).toBeDefined();
                    expect(stateNode.getState).toBeDefined();
                });
                it("should create the state node if we have set actions\n                and reducers before using create method: initial state", function () {
                    var stateNode = node
                        .set('reducers', {})
                        .set('actions', {})
                        .set('state', {})
                        .create();
                    expect(stateNode.createSubscriber).toBeDefined();
                    expect(stateNode.dispatchers).toBeDefined();
                    expect(stateNode.getState).toBeDefined();
                });
            });
        });
    });
    describe('when hooks are provided', function () {
        var stateHub;
        var stateNode;
        beforeEach(function () {
            stateHub = new index_1.StateHub();
            stateNode = stateHub.node('hooks-provided-test')
                .set('actions', {})
                .set('reducers', {})
                .set('state', {}, function (data) {
                return Object.assign({}, data, { test: 'test' });
            })
                .create();
        });
        it('should modify the data to be configured', function () {
            expect(stateNode.getState()).toEqual({
                test: 'test',
            });
        });
    });
    describe('state node #getState', function () {
        var stateHub;
        var stateNode;
        beforeEach(function () {
            stateHub = new index_1.StateHub();
            stateNode = stateHub.node('getState-test')
                .set('actions', {})
                .set('state', { test: 'test' })
                .set('reducers', {})
                .create();
        });
        it('should return current state', function () {
            expect(stateNode.getState()).toEqual({
                test: 'test',
            });
        });
    });
    describe('#createSubscriber', function () {
        describe('empty config', function () {
            var stateHub = new index_1.StateHub();
            var listener;
            var stateNode = stateHub
                .node('createSubscriber-test-empty-config')
                .set('actions', {
                test: function () { return ({
                    type: 'TEST',
                }); },
                test2: function () { return ({
                    type: 'TEST2',
                }); },
            })
                .set('state', {
                test: 'test',
            })
                .set('reducers', {
                TEST: function (state, action) {
                    return __assign({}, state, { test: 'TEST' });
                },
                TEST2: function (state, action) {
                    return __assign({}, state, { test: 'TEST2' });
                },
            })
                .create();
            beforeEach(function () {
                listener = jasmine.createSpy('listener');
            });
            it('returns a subscriber: executes listener', function () {
                var subscriber = stateNode.createSubscriber();
                expect(subscriber).toBeDefined();
                var unsubscribe = subscriber(listener);
                stateNode.dispatchers.test();
                unsubscribe();
                expect(listener).toHaveBeenCalled();
            });
        });
        describe('handler provided', function () {
            var obj;
            var stateHub = new index_1.StateHub();
            var stateNode = stateHub
                .node('createSubscriber-test-handler-provided')
                .set('actions', {
                test: function () { return ({
                    type: 'TEST',
                }); },
                test2: function () { return ({
                    type: 'TEST2',
                }); },
            })
                .set('state', {
                test: 'test',
            })
                .set('reducers', {
                TEST: function (state, action) {
                    return __assign({}, state, { test: 'test' });
                },
                TEST2: function (state, action) {
                    return __assign({}, state, { test: 'test2' });
                },
            })
                .create();
            beforeEach(function () {
                obj = {
                    handler: jasmine.createSpy('handler'),
                    listener: jasmine.createSpy('listener'),
                };
            });
            it('should execute handler: no listener executed ', function () {
                var subscriber = stateNode.createSubscriber({
                    handler: obj.handler,
                });
                expect(subscriber).toBeDefined();
                var unsubscribe = subscriber(obj.listener);
                stateNode.dispatchers.test();
                unsubscribe();
                expect(obj.handler).toHaveBeenCalled();
                expect(obj.listener).not.toHaveBeenCalled();
            });
            it('should execute handler: listener executed ', function () {
                obj.handler.and.callFake(function (state, listener) {
                    listener();
                });
                var subscriber = stateNode.createSubscriber({
                    handler: obj.handler,
                });
                expect(subscriber).toBeDefined();
                var unsubscribe = subscriber(obj.listener);
                stateNode.dispatchers.test();
                unsubscribe();
                expect(obj.handler).toHaveBeenCalled();
                expect(obj.listener).toHaveBeenCalled();
            });
        });
        describe('stateSelector provided', function () {
            var obj;
            var stateHub = new index_1.StateHub();
            var stateNode = stateHub
                .node('createSubscriber-test-stateselector-provided')
                .set('actions', {
                test: function () { return ({
                    type: 'TEST',
                }); },
                test2: function () { return ({
                    type: 'TEST2',
                }); },
            })
                .set('state', {
                test: 'test',
            })
                .set('reducers', {
                TEST: function (state, action) {
                    return __assign({}, state, { test: 'test' });
                },
                TEST2: function (state, action) {
                    return __assign({}, state, { test: 'test2' });
                },
            })
                .create();
            beforeEach(function () {
                obj = {
                    listener: jasmine.createSpy('listener'),
                    stateSelector: jasmine.createSpy('stateSelector').and.callFake(function (state) { return state.test; }),
                };
            });
            it('should execute setSelector: no listener executed', function () {
                var subscriber = stateNode.createSubscriber({
                    stateSelector: obj.stateSelector,
                });
                expect(subscriber).toBeDefined();
                var unsubscribe = subscriber(obj.listener);
                stateNode.dispatchers.test();
                unsubscribe();
                expect(obj.listener).not.toHaveBeenCalled();
            });
            it('should execute setSelector: listener executed on changing state', function () {
                var subscriber = stateNode.createSubscriber({
                    stateSelector: obj.stateSelector,
                });
                expect(subscriber).toBeDefined();
                var unsubscribe = subscriber(obj.listener);
                stateNode.dispatchers.test2();
                stateNode.dispatchers.test();
                unsubscribe();
                expect(obj.listener).toHaveBeenCalled();
            });
        });
    });
});
