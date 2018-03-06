// Returns any keys of TRecord with the type of TMatch
export type MatchingKeys<
  TRecord,
  TMatch,
  K extends keyof TRecord = keyof TRecord
  > = K extends (TRecord[K] extends TMatch ? K : never) ? K : never;

// Returns any property keys of Record with a void type
export type VoidKeys<Record> = MatchingKeys<Record, void>;

// TODO: Stash under a symbol key once TS compiler bug is fixed
export interface TypeRecord<T, U, V> {
  ' _emitterType'?: T,
  ' _eventsType'?: U,
  ' _emitType'?: V
}

// EventEmitter method overrides
export type OverriddenMethods<
  TEventRecord,
  TEmitRecord = TEventRecord,
  EventVK extends VoidKeys<TEventRecord> = VoidKeys<TEventRecord>,
  EventNVK extends Exclude<keyof TEventRecord, EventVK> =  Exclude<keyof TEventRecord, EventVK>,
  EmitVK extends VoidKeys<TEmitRecord> = VoidKeys<TEmitRecord>,
  EmitNVK extends Exclude<keyof TEmitRecord, EmitVK> =  Exclude<keyof TEmitRecord, EmitVK>
  > = {
    on<P extends EventNVK>(event: P, listener: (m: TEventRecord[P], ...args: any[]) => void): any;
    on<P extends EventVK>(event: P, listener: () => void): any;

    addListener<P extends EventNVK>(event: P, listener: (m: TEventRecord[P], ...args: any[]) => void): any
    addListener<P extends EventVK>(event: P, listener: () => void): any;

    addEventListener<P extends EventNVK>(event: P, listener: (m: TEventRecord[P], ...args: any[]) => void): any
    addEventListener<P extends EventVK>(event: P, listener: () => void): any;

    removeListener<P extends EventVK | EventNVK>(event: P, listener: Function): any;

    once<P extends EventNVK>(event: P, listener: (m: TEventRecord[P], ...args: any[]) => void): any
    once<P extends EventVK>(event: P, listener: () => void): any;

    emit<P extends EmitNVK>(event: P, request: TEmitRecord[P]): any;
    emit<P extends EmitVK>(event: P): any;
  }

export type OverriddenKeys = keyof OverriddenMethods<any, any, any>

export type StrictEventEmitter<
  TEmitterType,
  TEventRecord,
  TEmitRecord = TEventRecord,
  UnneededMethods extends Exclude<OverriddenKeys, keyof TEmitterType>
  = Exclude<OverriddenKeys, keyof TEmitterType>,
  NeededMethods extends Exclude<OverriddenKeys, UnneededMethods>
  = Exclude<OverriddenKeys, UnneededMethods>
  > =
  // Store the type parameters we've instantiated with so we can refer to them later
  TypeRecord<TEmitterType, TEventRecord, TEmitRecord> &

  // Pick all the methods on the original type we aren't going to override
  Pick<TEmitterType, Exclude<keyof TEmitterType, OverriddenKeys>> &

  // Finally, pick the needed overrides (taking care not to add an override for a method
  // that doesn't exist)
  Pick<OverriddenMethods<TEventRecord, TEmitRecord>, NeededMethods>;

export default StrictEventEmitter;

export type NoUndefined<T> = T extends undefined ? never : T;

export type StrictBroadcast<
  TEmitter extends TypeRecord<any, any, any>,
  TEmitRecord extends NoUndefined<TEmitter[' _emitType']> = NoUndefined<TEmitter[' _emitType']>,
  VK extends VoidKeys<TEmitRecord> = VoidKeys<TEmitRecord>,
  NVK extends Exclude<keyof TEmitRecord, VK> =  Exclude<keyof TEmitRecord, VK>
  > = {
    <E extends NVK>(event: E, request: TEmitRecord[E]): void;
    <E extends VK>(event: E): void;
  }
