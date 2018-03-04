## Typed Event Emitter

**NOTE: REQUIRES TYPESCRIPT 2.8 SUPPORT FOR CONDITIONAL TYPES**

A TypeScript library for strongly typed event emitters in 0 kB. Works with any kind of Event Emitter.

### Installing

```
npm i typed-event-emitter
```

### Usage

```ts
import TypedEventEmitter from 'typed-event-emitter';

// grab your event emitter
import { EventEmitter } from 'events';

// define your events
interface Events {
  newValue: number,
  done: void // void signals an event with no payload
}

// Create a typed event emitter
let ee: TypedEventEmitter<EventEmitter, Events> = new EventEmitter;

// now enjoy your strongly typed EventEmitter API!
ee.on('done', () => {}); // adding a callback parameter is an error
ee.on('newValue', x => x); // x is contextually typed to number
ee.on('somethingElse'); // mistyped events are an error
```

### TypedEventEmitter&lt;TEmitterType, TEventRecord, TEmitRecord>
The default export. A generic type that takes three type parameters:

1. *TEmitterType*: Your EventEmitter type (e.g. node's EventEmitter or socket.io socket)
2. *TEventRecord*: A type mapping event names to event payloads
3. *TEmitRecord*: Optionally, a similar type mapping things you can emit.

The third parameter is handy when typing web sockets where client and server can listen to and emit different events. For example, if you are using socket.io:

```ts
// create types representing the server side and client
// side sockets
export type ServerSocket =
  TypedEventEmitter<SocketIO.Socket, ServerSideProtocol, ClientSideProtocol>;
export type ClientSocket =
  TypedEventEmitter<SocketIOClient.Socket, ServerSideProtocol>;

// elsewhere on server
let socket: ServerSocket = new SocketIO.Socket();

// elsewhere on client
let socket: ClientSocket = new SocketIOClient.Socket();
```

### Broadcast&lt;TEmitter>
A type for a function which takes (and strictly checks) an emit event and a payload. *TEmitter* is the event emitter type instantiated from TypedEventEmitter.

Useful for broadcast abstractions. It is not possible to contextually type assigments to this type, so your declarations will look something like this:

```ts
import { Broadcast } from 'typed-event-emitter';

const broadcast: Broadcast<ServerSocket> = function (event: string, payload?: any) {
  // ...
}
```

Note that the loose types for event and payload only apply inside the broadcast function (consumers will see a much stricter signature). Declaring more precise types or narrowing the values using type guards would allow strongly-typed dispatching to multiple emitters.