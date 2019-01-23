# ReduxHub

Use this library to create redux state nodes so you can plug-in as many as you want behaving as if they were a single one.

[![Build Status](https://travis-ci.org/tcorral/redux-hub.svg?branch=master)](https://travis-ci.org/tcorral/redux-hub)
[![NPM Version](https://badge.fury.io/js/redux-hub.svg)](http://badge.fury.io/js/redux-hub)
[![Chat on Gitter](https://badges.gitter.im/tcorral/redux-hub.svg)](https://gitter.im/tcorral/redux-hub?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Installation

ReduxHub is available as an NPM package. You can install ReduxHub
in your project's directory as usual:

```bash
$ npm install redux-hub --save
```

## Usage

### ReduxHub
-------
### StateHub class api
ReduxHub provides you with a class to instanciate your hub node.
> StateHub is a [Generic class](https://www.typescriptlang.org/docs/handbook/generics.html) and can be configured in advance so [TypeScript](https://www.typescriptlang.org) can provide the right information.

#### Generics
On creating an instance of StateHub you need to provide the following Generics:

1. State - Provide your state interface.
2. Dispatchers - Provide your dispatchers interface.
3. HubModel - Provide the Hub model interface.
4. Result - Empty object where the node builder will store the used methods.

```typescript
import { StateHub } from 'redux-hub';

const stateHub = new StateHub<State, Dispatchers, Hub, {}>();
```
-------
### StateHub instance api
Once you have created the instance you will be provided with one method to setting up your hub node.

#### node
Node method gets only one argument, the scope name for your hub node.

```typescript
import { StateHub } from 'redux-hub';

const stateHub = new StateHub<State, Dispatchers, Hub, {}>();

const node = stateHub.node('scope-name');
```
-------
### Node builder api
Once we have set the node the api will provide two methods, one to set configuration and another
one to create the state node.

#### set
This method receives two arguments, the first is the name of the property to set up and the second is the object to configure it.

> The name of the properties that can be configured are **actions**, **reducers** and **state**.

**Actions and reducers are mandatory**

**State is optional if the initial state is an empty object**

```typescript
import { StateHub } from 'redux-hub';

const stateHub = new StateHub<State, Dispatchers, Hub, {}>();

stateHub
    .node('scope-name')
    .set('actions', {})
    .set('reducers', {})
    .set('state', {});
```

#### create
This method, once you have configured the state node, can be used to get the state node instance.

> Creating a node without configuring actions and reducers first will throw an error.

```typescript
import { StateHub } from 'redux-hub';

const stateHub = new StateHub<State, Dispatchers, Hub, {}>();

const stateNode = stateHub
                    .node('scope-name')
                    .set('actions', {})
                    .set('reducers', {})
                    .set('state', {}) // In this case this line could be skipped.
                    .create();
```

-------
### ReduxHub Node API

#### dispatchers
This object wraps the action creators and dispatches the action on executing it.

```javascript
node.dispatchers.test();
```

#### getState
This method returns node state.

```javascript
node.getState();
```

#### createSubscriber
This method creates a subscriber to changes in state.

##### Subscriber Configuration Examples

**Listening to any change in global state**
If you don't pass any configuration object to the subscriber it will listening to any state change and the listener function will be executed.

```javascript
const subscriber = node.createSubscriber();
subscriber(listener);
```

**Listening to any change in ReduxHub Node state**
If you want to react to all the changes in your ReduxHub Node state you have to pass a function that will return the state.

> The listener function will be executed only if the state changed since last time it was executed.

```javascript
const subscriber = node.createSubscriber({
    stateSelector: (state) => state
});
subscriber(listener);
```

**Listening to an specific change in ReduxHub Node state**
If you want to react to an specific change in your state you have to pass a function that will return the state you want to check.

> The listener function will be executed only if the specific state changed since last time it was executed.

```javascript
const subscriber = node.createSubscriber({
    stateSelector: (state) => state.test
});
subscriber(listener);
```

**Executing some code before executing the listener function**
If you need to execute some code before executing the listener function you can provide this function.

This function receives an object with the previous state and the current state.

> The function will be only executed if the previous state and the current one are different.

> If a function is provided as a handler property, the listener must be executed from inside of this function.

```javascript
const subscriber = node.createSubscriber({
    handler: (stateHolder, listener) => {
        console.log(state.previous);
        console.log(state.current);
        listener();
    }
});
subscriber(listener);
```

>You can also combine both methods to execute the handler only when an specific state has changed.

## API documentation
API Documentation can be generated executing ```npm run docs```.
The documentation generated can be found inside the **docs** folder.

## Build the source
This library has been written using [TypeScript](http://typescriptlang.org).
If you need to use it in your project but you are not working with TypeScript you can always to build the code using ```npm run build``` This command will *lint your code*, *run the tests* and *compile to TypeScript.

## Contributing

This project is maintained by a community of developers. Contributions are welcome and appreciated.
You can find ReduxHub on GitHub; feel free to start an issue or create a pull requests:<br>
[https://github.com/tcorral/redux-hub](https://github.com/tcorral/redux-hub)

For more information, read the [contribution guide](https://github.com/tcorral/redux-hub/blob/master/CONTRIBUTING.md).

## License

Copyright (c) 2019 [Tomas Corral](http://github.com/tcorral).<br>
Copyright (c) 2019 [ReduxHub Contributors](https://github.com/tcorral/redux-hub/graphs/contributors).<br>
Licensed under the MIT License.