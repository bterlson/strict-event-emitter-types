export type MatchingKeys<T, U, K extends keyof T = keyof T> =
  K extends (T[K] extends U ? K : never) ? K : never;

export type VoidKeys<Record> = MatchingKeys<Record, void>;

type TypedEventEmitter<EmitterType, Events, EmitEvents = Events> = Pick<EmitterType, Exclude<keyof EmitterType, 'on' | 'emit' | 'addListener' | 'once' | 'removeListener'>> &
  {
    on<P extends Exclude<keyof Events, VoidKeys<Events>>>(event: P, listener: (m: Events[P], ...args: any[]) => void): any
    on<P extends VoidKeys<Events>>(event: P, listener: () => void): any;

    addListener<P extends Exclude<keyof Events, VoidKeys<Events>>>(event: P, listener: (m: Events[P], ...args: any[]) => void): any
    addListener<P extends VoidKeys<Events>>(event: P, listener: () => void): any;

    removeListener<P extends VoidKeys<Events>>(event: P, listener: Function): any;

    once<P extends Exclude<keyof Events, VoidKeys<Events>>>(event: P, listener: (m: Events[P], ...args: any[]) => void): any
    once<P extends VoidKeys<Events>>(event: P, listener: () => void): any;

    emit<P extends Exclude<keyof EmitEvents, VoidKeys<EmitEvents>>>(event: P, request: EmitEvents[P]): any;
    emit<P extends VoidKeys<EmitEvents>>(event: P): any;
  }

export default TypedEventEmitter;

export function wrap<Events extends object, EmitEvents extends object = Events, T={}>(t: T): TypedEventEmitter<T, Events, EmitEvents> & T {
  return t as any; // unsure why this is necessary
}
