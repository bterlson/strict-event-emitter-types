// note that this file is never run, it's only type assertions
// currently unsure how to do negative tests.

import StrictEventEmitter, {
  StrictBroadcast,
  EventNames,
  OnEventNames,
  EmitEventNames
} from '../src/index';

// set up some events
interface Position {
  x: number;
  y: number;
}
interface Events {
  move: Position;
  done: void;
}

interface Emitables {
  moveRequest: Position;
  stop: void;
}
// test with Node's event emitter
import { EventEmitter } from 'events';
let asdf = new EventEmitter();
let o = asdf.on;
let r = asdf.removeListener;

let eei: StrictEventEmitter<EventEmitter, Events> = new EventEmitter();
eei.addListener('move', () => {}).removeListener('move', () => {});

function cb(p: Position) {}
let v = eei.on('move', v => v.x + v.y);
v.on('done', function() {}); // node event emitters support chaining

eei.emit('move', { x: 1, y: 2 });
eei.emit('done');
eei.addListener('move', cb);
eei.addListener('done', function() {});
eei.once('move', v => v.x + v.y);
eei.once('done', function() {});
eei.removeListener('move', cb);
eei.removeListener('done', function() {});
eei.emit('move', { x: 1, y: 2 });
eei.emit('done');

let eventNames: EventNames<typeof eei>;
eventNames = 'move';
eventNames = 'done';

let eei2: StrictEventEmitter<
  EventEmitter,
  Events,
  Emitables
> = new EventEmitter();
eei2.on('move', v => v.x + v.y);
eei2.on('done', function() {});
eei2.addListener('move', v => v.x + v.y);
eei2.addListener('done', function() {});
eei2.once('move', v => v.x + v.y);
eei2.once('done', function() {});
eei2.removeListener('move', cb);
eei2.removeListener('done', function() {});
eei2.emit('moveRequest', { x: 1, y: 2 });
eei2.emit('stop');

let names2: EventNames<typeof eei2>;
names2 = 'move';
names2 = 'done';
names2 = 'moveRequest';
names2 = 'stop';

let emitNames: EmitEventNames<typeof eei2>;
emitNames = 'moveRequest';
emitNames = 'stop';

let onNames: OnEventNames<typeof eei2>;
onNames = 'move';
onNames = 'done';

// names = 'asdf'; // should error

var broadcast: StrictBroadcast<typeof eei2> = function(
  e: string,
  payload?: any
) {
  if (e === 'move') {
    eei.emit(e, payload);
  } else if (e === 'done') {
    eei.emit(e);
    return '1'; // can return anything
  }

  throw 'unknown event';
};
broadcast('stop');
broadcast('moveRequest', { x: 1, y: 2 });

// custom event emitter without chaining
interface CustomEE {
  on(e: string, cb: Function): void;
}

let cee: StrictEventEmitter<CustomEE, Events> = { on: () => undefined };
let val = cee.on('move', pos => {}); // val should be void
