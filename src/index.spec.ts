import {} from 'jasmine';
import { AnyAction } from 'redux';
import {
    Hub, IStateNode,
} from './hub-model';
import {
    StateHub,
} from './index';
import { INodeApiComplete } from './node-builder';

describe('redux-hub', () => {

    describe('StateHub', () => {
        it('should exist StateHub', () => {
            expect(StateHub).toBeDefined();
        });
    });

    describe('public api', () => {
        let stateHub: StateHub<{}, {}, Hub, {}>;
        beforeEach(() => {
            stateHub = new StateHub<{}, {}, Hub, {}>();
        });

        describe('#constructor', () => {
            it('should return an instance', () => {
                expect(stateHub.node).toBeDefined();
            });
        });

        describe('#node', () => {
            let node: INodeApiComplete<{}, {}, Hub, {}>;
            beforeEach(() => {
                node = stateHub.node('test');
            });

            it('should return set and create api', () => {
                expect(node.set).toBeDefined();
                expect(node.create).toBeDefined();
            });

            describe('#set', () => {
                it('should return the set and create api', () => {
                    const api = node.set('actions');
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

            describe('#create', () => {
                it(`should throw an error if we have not set actions
                and reducers before using create method: nothing set`, () => {
                    expect(() => {
                        node.create();
                    }).toThrow();
                });
                it(`should throw an error if we have not set actions
                and reducers before using create method: setting actions only`, () => {
                    expect(() => {
                        node
                        .set('actions', {})
                        .create();
                    }).toThrow();
                });
                it(`should throw an error if we have not set actions
                and reducers before using create method: setting actions and state only`, () => {
                    expect(() => {
                        node
                        .set('actions', {})
                        .set('state', {})
                        .create();
                    }).toThrow();
                });
                it(`should throw an error if we have not set actions
                and reducers before using create method: setting reducers only`, () => {
                    expect(() => {
                        node
                        .set('reducers', {})
                        .create();
                    }).toThrow();
                });
                it(`should throw an error if we have not set actions
                and reducers before using create method: setting reducers and state only`, () => {
                    expect(() => {
                        node
                        .set('reducers', {})
                        .set('state', {})
                        .create();
                    }).toThrow();
                });
                it(`should create the state node if we have set actions
                and reducers before using create method: no initial state`, () => {
                    const stateNode = node
                    .set('reducers', {})
                    .set('actions', {})
                    .create();
                    expect(stateNode.createSubscriber).toBeDefined();
                    expect(stateNode.dispatchers).toBeDefined();
                    expect(stateNode.getState).toBeDefined();
                });
                it(`should create the state node if we have set actions
                and reducers before using create method: initial state`, () => {
                    const stateNode = node
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

    describe('state node #getState', () => {
        let stateHub: StateHub<{ test: string }, {}, Hub, {}>;
        let stateNode: IStateNode<{ test: string }, {}>;
        beforeEach(() => {
            stateHub = new StateHub<{ test: string }, {}, Hub, {}>();
            stateNode = stateHub.node('getState-test')
            .set('actions', {})
            .set('state', { test: 'test' })
            .set('reducers', {})
            .create();
        });

        it('should return current state', () => {
            expect(stateNode.getState()).toEqual({
                test: 'test',
            });
        });
    });

    describe('#createSubscriber', () => {
        describe('empty config', () => {
            const stateHub: StateHub<{ test: string }, { test: any, test2: any }, Hub, {}> =
                new StateHub<{ test: string }, { test: any, test2: any }, Hub, {}>();
            let listener: jasmine.Spy;
            const stateNode: IStateNode<{ test: string }, { test: any, test2: any }> =
                stateHub
                .node('createSubscriber-test-empty-config')
                .set('actions', {
                        test: () => ({
                            type: 'TEST',
                        }),
                        test2: () => ({
                            type: 'TEST2',
                        }),
                    })
                .set('state', {
                        test: 'test',
                })
                .set('reducers', {
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
                })
                .create();

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
            const stateHub: StateHub<{ test: string }, { test: any, test2: any }, Hub, {}> =
                new StateHub<{ test: string }, { test: any, test2: any }, Hub, {}>();
            const stateNode: IStateNode<{ test: string }, { test: any, test2: any }> =
                stateHub
                .node('createSubscriber-test-handler-provided')
                .set('actions', {
                    test: () => ({
                        type: 'TEST',
                    }),
                    test2: () => ({
                        type: 'TEST2',
                    }),
                })
                .set('state', {
                    test: 'test',
                })
                .set('reducers', {
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
                })
                .create();
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
            const stateHub: StateHub<{ test: string }, { test: any, test2: any }, Hub, {}> =
                new StateHub<{ test: string }, { test: any, test2: any }, Hub, {}>();
            const stateNode: IStateNode<{ test: string }, { test: any, test2: any }> =
                stateHub
                .node('createSubscriber-test-stateselector-provided')
                .set('actions', {
                    test: () => ({
                        type: 'TEST',
                    }),
                    test2: () => ({
                        type: 'TEST2',
                    }),
                })
                .set('state', {
                    test: 'test',
                })
                .set('reducers', {
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
                })
                .create();

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
