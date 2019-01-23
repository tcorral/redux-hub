"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var uuidv4 = __importStar(require("uuid/v4"));
var hub_model_1 = require("./hub-model");
var NodeBuilder = /** @class */ (function () {
    function NodeBuilder() {
        this.node = function (scopeName) {
            if (scopeName === void 0) { scopeName = uuidv4(); }
            var hubModel = new hub_model_1.HubModel(scopeName);
            var executionTrack = {};
            var create = function () {
                if (!executionTrack.actions || !executionTrack.reducers) {
                    throw new Error('Unable to create node. Actions and reducers are required.');
                }
                if (!executionTrack.state) {
                    hubModel.state({});
                }
                return hubModel.create();
            };
            var set = function (method, data, hook) {
                executionTrack[method] = true;
                if (typeof hook === 'function') {
                    data = hook(data);
                }
                hubModel[method](data);
                return {
                    create: create,
                    set: set,
                };
            };
            return {
                create: create,
                set: set,
            };
        };
    }
    return NodeBuilder;
}());
exports.NodeBuilder = NodeBuilder;
