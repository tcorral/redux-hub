import { NodeBuilder } from './node-builder';

export { IStateNode, IActionCreators, IReducers, Hub } from './hub-model';
export class StateHub<State, Dispatchers, model, result> extends NodeBuilder<State, Dispatchers, model, result> { }
