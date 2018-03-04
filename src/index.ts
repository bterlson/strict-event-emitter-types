export type MatchingKeys<T, U, K extends keyof T = keyof T> =
  K extends (T[K] extends U ? K : never) ? K : never;

export type VoidKeys<Record> = MatchingKeys<Record, void>;

// really wish I could stash these under a unique symbol key
export interface TypeRecord<T, U, V> {
  ' _emitterType'?: T,
  ' _eventsType'?: U,
  ' _emitType'?: V
}

export type TypedEventEmitter<
  TEmitterType,
  TEventRecord,
  TEmitRecord = TEventRecord,
  EventVK extends VoidKeys<TEventRecord> = VoidKeys<TEventRecord>,
  EventNVK extends Exclude<keyof TEventRecord, EventVK> =  Exclude<keyof TEventRecord, EventVK>,
  EmitVK extends VoidKeys<TEmitRecord> = VoidKeys<TEmitRecord>,
  EmitNVK extends Exclude<keyof TEmitRecord, EmitVK> =  Exclude<keyof TEmitRecord, EmitVK>
  > =
  TypeRecord<TEmitterType, TEventRecord, TEmitRecord> &
  Pick<TEmitterType, Exclude<keyof TEmitterType, 'on' | 'emit' | 'addListener' | 'once' | 'removeListener'>> &
  {
    on<P extends EventNVK>(event: P, listener: (m: TEventRecord[P], ...args: any[]) => void): any;
    on<P extends EventVK>(event: P, listener: () => void): any;

    addListener<P extends EventNVK>(event: P, listener: (m: TEventRecord[P], ...args: any[]) => void): any
    addListener<P extends EventVK>(event: P, listener: () => void): any;

    removeListener<P extends EventVK>(event: P, listener: Function): any;

    once<P extends EventNVK>(event: P, listener: (m: TEventRecord[P], ...args: any[]) => void): any
    once<P extends EventVK>(event: P, listener: () => void): any;

    emit<P extends EmitNVK>(event: P, request: TEmitRecord[P]): any;
    emit<P extends EmitVK>(event: P): any;
  }

export default TypedEventEmitter;

export type NoUndefined<T> = T extends undefined ? never : T;
export type Broadcast<
  TEmitter extends TypeRecord<any, any, any>,
  TEmitRecord extends NoUndefined<TEmitter[' _emitType']> = NoUndefined<TEmitter[' _emitType']>,
  VK extends VoidKeys<TEmitRecord> = VoidKeys<TEmitRecord>,
  NVK extends Exclude<keyof TEmitRecord, VK> =  Exclude<keyof TEmitRecord, VK>
  > = {
    <E extends NVK>(event: E, request: TEmitRecord[E]): void;
    <E extends VK>(event: E): void;
  }