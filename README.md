## Typed Event Emitter

**NOTE: REQUIRES TYPESCRIPT 2.8 SUPPORT FOR CONDITIONAL TYPES**

A TypeScript library for strongly typed event emitters in 0 kB. Works with any object implementing the EventEmitter API, and does not wrap or alter the object. As a result, the library is just types.

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
ee.on('done'); // adding a callback here would be an error
ee.on('newValue', x => x); // x is contextually typed to number
ee.on('somethingElse'); // mistyped events are an error
```

Typed Event Emitter's default export is a generic type that takes three type parameters: your EventEmitter type, a record of your events, and optionally a record of what you emit. The third type parameter defaults to the second, but it is handy when typing web sockets where client and server can listen to and emit different events.

For example, if you are using socket.io:

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
let socket: ServerSocket = new SocketIOClient.Socket();
```