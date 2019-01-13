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
    describe('public api', function () {
        it('should return stateHub instance', function () {
            expect(index_1.stateHub).toBeDefined();
            expect(index_1.stateHub.createNode).toBeDefined();
        });
    });
    describe('#createNode', function () {
        var stateNode = index_1.stateHub.createNode({
            actionCreators: {},
            initialState: {},
            name: 'test',
            reducers: [],
        });
        it('should return the StateNode public API', function () {
            expect(stateNode).toBeDefined();
        });
    });
    describe('#getState', function () {
        var stateNode = index_1.stateHub.createNode({
            actionCreators: {},
            initialState: {
                test: 'test',
            },
            name: 'getState-test',
            reducers: [],
        });
        it('should return current state', function () {
            expect(stateNode.getState()).toEqual({
                test: 'test',
            });
        });
    });
    describe('#createSubscriber', function () {
        describe('empty config', function () {
            var listener;
            var stateNode = index_1.stateHub.createNode({
                actionCreators: {
                    test: function () { return ({
                        type: 'TEST',
                    }); },
                    test2: function () { return ({
                        type: 'TEST2',
                    }); },
                },
                initialState: {
                    test: 'test',
                },
                name: 'createSubscriber-test-empty-config',
                reducers: {
                    TEST: function (state, action) {
                        return __assign({}, state, { test: 'TEST' });
                    },
                    TEST2: function (state, action) {
                        return __assign({}, state, { test: 'TEST2' });
                    },
                },
            });
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
            var stateNode = index_1.stateHub.createNode({
                actionCreators: {
                    test: function () { return ({
                        type: 'TEST',
                    }); },
                    test2: function () { return ({
                        type: 'TEST2',
                    }); },
                },
                initialState: {
                    test: 'test',
                },
                name: 'createSubscriber-test-handler-provided',
                reducers: {
                    TEST: function (state, action) {
                        return __assign({}, state, { test: 'test' });
                    },
                    TEST2: function (state, action) {
                        return __assign({}, state, { test: 'test2' });
                    },
                },
            });
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
            var stateNode = index_1.stateHub.createNode({
                actionCreators: {
                    test: function () { return ({
                        type: 'TEST',
                    }); },
                    test2: function () { return ({
                        type: 'TEST2',
                    }); },
                },
                initialState: {
                    test: 'test',
                },
                name: 'createSubscriber-test-stateselector-provided',
                reducers: {
                    TEST: function (state, action) {
                        return __assign({}, state, { test: 'test' });
                    },
                    TEST2: function (state, action) {
                        return __assign({}, state, { test: 'test2' });
                    },
                },
            });
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
