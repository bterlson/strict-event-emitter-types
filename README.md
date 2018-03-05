## Typed Event Emitter

**NOTE: REQUIRES TYPESCRIPT 2.8 SUPPORT FOR CONDITIONAL TYPES**

A TypeScript library for strongly typed event emitters in 0 kB. Works with any kind of EventEmitter.

### Installing

```
npm i strict-event-emitter-types
```

### Usage

```ts
import StrictEventEmitter from 'strict-event-emitter-types';

// grab your event emitter
import { EventEmitter } from 'events';

// define your events
interface Events {
  newValue: number,
  done: void // an event with no payload
}

// Create a typed event emitter
let ee: StrictEventEmitter<EventEmitter, Events> = new EventEmitter;

// now enjoy your strongly typed EventEmitter API!
ee.on('newValue', x => x); // x is contextually typed to number

ee.on('somethingElse'); // Error: unknown event
ee.on('done', x => x); // Error: 'done' does not have a payload
ee.emit('newValue', 'hello!'); // Error: incorrect payload
ee.emit('newValue'); // Error: forgotten payload
```

### StrictEventEmitter&lt;TEmitterType, TEventRecord, TEmitRecord>
The default export. A generic type that takes three type parameters:

1. *TEmitterType*: Your EventEmitter type (e.g. node's EventEmitter or socket.io socket)
2. *TEventRecord*: A type mapping event names to event payloads
3. *TEmitRecord*: Optionally, a similar type mapping things you can emit.

The third parameter is handy when typing web sockets where client and server can listen to and emit different events. For example, if you are using socket.io:

```ts
// create types representing the server side and client
// side sockets
export type ServerSocket =
  StrictEventEmitter<SocketIO.Socket, EventsFromServer, EventsFromClient>;
export type ClientSocket =
  StrictEventEmitter<SocketIOClient.Socket, EventsFromClient, EventsFromServer>;

// elsewhere on server
let serverSocket: ServerSocket = new SocketIO.Socket();
serverSocket.on(/* only events that are sent from the client are allowed */, ...)
serverSocket.emit(/* only events that are emitted from the server are allowed */, ...)

// elsewhere on client
let clientSocket: ClientSocket = new SocketIOClient.Socket();
clientSocket.on(/* only events that are sent from the server are allowed */, ...)
clientSocket.emit(/* only events that are emitted from the client are allowed */, ...)
```

### StrictBroadcast&lt;TStrictEventEmitter>
A type for a function which takes (and strictly checks) an emit event and a payload. *TStrictEventEmitter* is the event emitter type instantiated from StrictEventEmitter.

Useful for broadcast abstractions. It is not possible to contextually type assigments to this type, so your declarations will look something like this:

```ts
import { StrictBroadcast } from 'strict-event-emitter-types';

const broadcast: StrictBroadcast<ServerSocket> = function (event: string, payload?: any) {
  // ...
}
```

Note that the loose types for event and payload only apply inside the broadcast function (consumers will see a much stricter signature). Declaring more precise parameter types or narrowing using type guards would allow strongly-typed dispatching to emitters.
