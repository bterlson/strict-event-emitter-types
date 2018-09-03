// note that this file is never run, it's only type assertions

import StrictEventEmitter, {
  StrictBroadcast,
  EventNames,
  OnEventNames,
  EmitEventNames
} from '../src/index';

interface Position {
  x: number;
  y: number;
}

interface Events {
  move: (from: Position, to: Position) => void;
  jump: number;
  done: void;
}

interface Emitables {
  moveRequest: (from: Position, to: Position) => void;
  jumpRequest: number;
  stop: void;
}

// test with Node's event emitter
import { EventEmitter } from 'events';

let eei: StrictEventEmitter<EventEmitter, Events> = new EventEmitter();

function cb(p: Position) {}
let v = eei.on('move', v => v.x + v.y);
v.on('done', function() {}); // node event emitters support chaining

eei.emit('move', { x: 1, y: 2 }, { x: 1, y: 2 });
eei.emit('done');
eei.addListener('move', cb);
eei.addListener('done', function() {});
eei.once('move', v => v.x + v.y);
eei.once('done', function() {});
eei.removeListener('move', cb);
eei.removeListener('done', function() {});
eei.emit('move', { x: 1, y: 2 }, { x: 1, y: 2 });
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
eei2.emit('moveRequest', { x: 1, y: 2 }, { x: 1, y: 2 });
eei2.emit('stop');
eei2.emit('jumpRequest', 10);
