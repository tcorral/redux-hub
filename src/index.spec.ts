import {} from 'jasmine';
import { AnyAction } from 'redux';
import {
    IStateNode,
    stateHub,
} from './index';

describe('redux-hub', () => {
    describe('public api', () => {
        it('should return stateHub instance', () => {
            expect(stateHub).toBeDefined();
            expect(stateHub.createNode).toBeDefined();
        });
    });
    describe('#createNode', () => {
        const stateNode: IStateNode<{}, {}> = stateHub.createNode<{}, {}>({
            actionCreators: {},
            initialState: {},
            name: 'test',
            reducers: [],
        });
        it('should return the StateNode public API', () => {
            expect(stateNode).toBeDefined();
        });
    });

    describe('#getState', () => {
        const stateNode: IStateNode<{ test: string }, {}> = stateHub.createNode<{ test: string }, {}>({
            actionCreators: {},
            initialState: {
                test: 'test',
            },
            name: 'getState-test',
            reducers: [],
        });
        it('should return current state', () => {
            expect(stateNode.getState()).toEqual({
                test: 'test',
            });
        });
    });

    describe('#createSubscriber', () => {
        describe('empty config', () => {
            let listener: jasmine.Spy;
            const stateNode: IStateNode<{ test: string }, { test: any, test2: any }> =
                stateHub.createNode<{ test: string }, { test: any, test2: any }>({
                    actionCreators: {
                        test: () => ({
                            type: 'TEST',
                        }),
                        test2: () => ({
                            type: 'TEST2',
                        }),
                    },
                    initialState: {
                        test: 'test',
                    },
                    name: 'createSubscriber-test-empty-config',
                    reducers: {
                        TEST: (state: any, action: AnyAction) => {
                            return {
                                ...state,
                                test: 'TEST',
                            };
                        },
                        TEST2: (state: any, action: AnyAction) => {
                            return {
                                ...state,
                                test: 'TEST2',
                            };
                        },
                    },
                });
            beforeEach(() => {
                listener = jasmine.createSpy('listener');
            });
            it('returns a subscriber: executes listener', () => {
                const subscriber = stateNode.createSubscriber();
                expect(subscriber).toBeDefined();

                const unsubscribe = subscriber(listener);
                stateNode.dispatchers.test();
                unsubscribe();

                expect(listener).toHaveBeenCalled();
            });
        });

        describe('handler provided', () => {
            let obj: { handler: jasmine.Spy, listener: jasmine.Spy };
            const stateNode: IStateNode<{ test: string }, { test: any, test2: any }> =
                stateHub.createNode<{ test: string }, { test: any, test2: any }>({
                    actionCreators: {
                        test: () => ({
                            type: 'TEST',
                        }),
                        test2: () => ({
                            type: 'TEST2',
                        }),
                    },
                    initialState: {
                        test: 'test',
                    },
                    name: 'createSubscriber-test-handler-provided',
                    reducers: {
                        TEST: (state: any, action: AnyAction) => {
                            return {
                                ...state,
                                test: 'test',
                            };
                        },
                        TEST2: (state: any, action: AnyAction) => {
                            return {
                                ...state,
                                test: 'test2',
                            };
                        },
                    },
                });
            beforeEach(() => {
                obj = {
                    handler: jasmine.createSpy('handler'),
                    listener: jasmine.createSpy('listener'),
                };
            });
            it('should execute handler: no listener executed ', () => {
                const subscriber = stateNode.createSubscriber({
                    handler: obj.handler,
                });
                expect(subscriber).toBeDefined();

                const unsubscribe = subscriber(obj.listener);
                stateNode.dispatchers.test();
                unsubscribe();

                expect(obj.handler).toHaveBeenCalled();
                expect(obj.listener).not.toHaveBeenCalled();
            });
            it('should execute handler: listener executed ', () => {
                obj.handler.and.callFake((state: any, listener: () => void) => {
                    listener();
                });
                const subscriber = stateNode.createSubscriber({
                    handler: obj.handler,
                });
                expect(subscriber).toBeDefined();

                const unsubscribe = subscriber(obj.listener);
                stateNode.dispatchers.test();
                unsubscribe();

                expect(obj.handler).toHaveBeenCalled();
                expect(obj.listener).toHaveBeenCalled();
            });
        });
        describe('stateSelector provided', () => {
            let obj: { listener: jasmine.Spy, stateSelector: jasmine.Spy };
            const stateNode: IStateNode<{ test: string }, { test: any, test2: any }> =
                stateHub.createNode<{ test: string }, { test: any, test2: any }>({
                    actionCreators: {
                        test: () => ({
                            type: 'TEST',
                        }),
                        test2: () => ({
                            type: 'TEST2',
                        }),
                    },
                    initialState: {
                        test: 'test',
                    },
                    name: 'createSubscriber-test-stateselector-provided',
                    reducers: {
                        TEST: (state: any, action: AnyAction) => {
                            return {
                                ...state,
                                test: 'test',
                            };
                        },
                        TEST2: (state: any, action: AnyAction) => {
                            return {
                                ...state,
                                test: 'test2',
                            };
                        },
                    },
                });
            beforeEach(() => {
                obj = {
                    listener: jasmine.createSpy('listener'),
                    stateSelector: jasmine.createSpy('stateSelector').and.callFake((state: any) => state.test ),
                };
            });
            it('should execute setSelector: no listener executed', () => {
                const subscriber = stateNode.createSubscriber({
                    stateSelector: obj.stateSelector,
                });
                expect(subscriber).toBeDefined();

                const unsubscribe = subscriber(obj.listener);
                stateNode.dispatchers.test();
                unsubscribe();

                expect(obj.listener).not.toHaveBeenCalled();
            });
            it('should execute setSelector: listener executed on changing state', () => {
                const subscriber = stateNode.createSubscriber({
                    stateSelector: obj.stateSelector,
                });
                expect(subscriber).toBeDefined();

                const unsubscribe = subscriber(obj.listener);
                stateNode.dispatchers.test2();
                stateNode.dispatchers.test();
                unsubscribe();

                expect(obj.listener).toHaveBeenCalled();
            });
        });
    });
});
