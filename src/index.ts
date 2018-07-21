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
  ' _emitterType'?: T;
  ' _eventsType'?: U;
  ' _emitType'?: V;
}

export type ReturnTypeOfMethod<T> = T extends (...args: any[]) => any
  ? ReturnType<T>
  : void;

export type ReturnTypeOfMethodIfExists<T, S extends string> = S extends keyof T
  ? ReturnTypeOfMethod<T[S]>
  : void;

export type InnerEEMethodReturnType<T, TValue, FValue> = T extends (
  ...args: any[]
) => any
  ? ReturnType<T> extends void | undefined ? FValue : TValue
  : FValue;

export type EEMethodReturnType<
  T,
  S extends string,
  TValue,
  FValue = void
> = S extends keyof T ? InnerEEMethodReturnType<T[S], TValue, FValue> : FValue;

type ListenerType<T>  = [T] extends [(...args: infer U) => any]
  ? U
  : [T, ...any[]];

// EventEmitter method overrides
export type OverriddenMethods<
  TEmitter,
  TEventRecord,
  TEmitRecord = TEventRecord,
  EventVK extends VoidKeys<TEventRecord> = VoidKeys<TEventRecord>,
  EventNVK extends Exclude<keyof TEventRecord, EventVK> = Exclude<
    keyof TEventRecord,
    EventVK
  >,
  EmitVK extends VoidKeys<TEmitRecord> = VoidKeys<TEmitRecord>,
  EmitNVK extends Exclude<keyof TEmitRecord, EmitVK> = Exclude<
    keyof TEmitRecord,
    EmitVK
  >
> = {
  on<P extends EventNVK, T>(
    this: T,
    event: P,
    listener: (...args: ListenerType<TEventRecord[P]>) => void
  ): EEMethodReturnType<TEmitter, 'on', T>;

  on<P extends EventVK, T>(
    this: T,
    event: P,
    listener: () => void
  ): EEMethodReturnType<TEmitter, 'on', T>;

  addListener<P extends EventNVK, T>(
    this: T,
    event: P,
    listener: (...args: ListenerType<TEventRecord[P]>) => void
  ): EEMethodReturnType<TEmitter, 'addListener', T>;

  addListener<P extends EventVK, T>(
    this: T,
    event: P,
    listener: () => void
  ): EEMethodReturnType<TEmitter, 'addListener', T>;

  addEventListener<P extends EventNVK, T>(
    this: T,
    event: P,
    listener: (...args: ListenerType<TEventRecord[P]>) => void
  ): EEMethodReturnType<TEmitter, 'addEventListener', T>;

  addEventListener<P extends EventVK, T>(
    this: T,
    event: P,
    listener: () => void
  ): EEMethodReturnType<TEmitter, 'addEventListener', T>;

  removeListener<P extends EventNVK, T>(
    this: T,
    event: P,
    listener: Function
  ): EEMethodReturnType<TEmitter, 'removeListener', T>;

  removeListener<P extends EventVK, T>(
    this: T,
    event: P,
    listener: Function
  ): EEMethodReturnType<TEmitter, 'removeListener', T>;

  removeEventListener<P extends EventNVK, T>(
    this: T,
    event: P,
    listener: Function
  ): EEMethodReturnType<TEmitter, 'removeEventListener', T>;

  removeEventListener<P extends EventVK, T>(
    this: T,
    event: P,
    listener: Function
  ): EEMethodReturnType<TEmitter, 'removeEventListener', T>;

  once<P extends EventNVK, T>(
    this: T,
    event: P,
    listener: (...args: ListenerType<TEventRecord[P]>) => void
  ): EEMethodReturnType<TEmitter, 'once', T>;
  once<P extends EventVK, T>(
    this: T,
    event: P,
    listener: () => void
  ): EEMethodReturnType<TEmitter, 'once', T>;

  emit<P extends EmitNVK, T>(
    this: T,
    event: P,
    ... args: ListenerType<TEmitRecord[P]>
  ): EEMethodReturnType<TEmitter, 'emit', T>;

  emit<P extends EmitVK, T>(
    this: T,
    event: P
  ): EEMethodReturnType<TEmitter, 'emit', T>;
};

export type OverriddenKeys = keyof OverriddenMethods<any, any, any>;

export type StrictEventEmitter<
  TEmitterType,
  TEventRecord,
  TEmitRecord = TEventRecord,
  UnneededMethods extends Exclude<OverriddenKeys, keyof TEmitterType> = Exclude<
    OverriddenKeys,
    keyof TEmitterType
  >,
  NeededMethods extends Exclude<OverriddenKeys, UnneededMethods> = Exclude<
    OverriddenKeys,
    UnneededMethods
  >
> =
  // Store the type parameters we've instantiated with so we can refer to them later
  TypeRecord<TEmitterType, TEventRecord, TEmitRecord> &
    // Pick all the methods on the original type we aren't going to override
    Pick<TEmitterType, Exclude<keyof TEmitterType, OverriddenKeys>> &
    // Finally, pick the needed overrides (taking care not to add an override for a method
    // that doesn't exist)
    Pick<
      OverriddenMethods<TEmitterType, TEventRecord, TEmitRecord>,
      NeededMethods
    >;

export default StrictEventEmitter;

export type NoUndefined<T> = T extends undefined ? never : T;

export type StrictBroadcast<
  TEmitter extends TypeRecord<any, any, any>,
  TEmitRecord extends NoUndefined<TEmitter[' _emitType']> = NoUndefined<
    TEmitter[' _emitType']
  >,
  VK extends VoidKeys<TEmitRecord> = VoidKeys<TEmitRecord>,
  NVK extends Exclude<keyof TEmitRecord, VK> = Exclude<keyof TEmitRecord, VK>
> = {
  <E extends NVK>(event: E, request: TEmitRecord[E]): any;
  <E extends VK>(event: E): any;
};

export type EventNames<
  TEmitter extends TypeRecord<any, any, any>,
  TEventRecord extends NoUndefined<TEmitter[' _eventsType']> = NoUndefined<
    TEmitter[' _eventsType']
  >,
  TEmitRecord extends NoUndefined<TEmitter[' _emitType']> = NoUndefined<
    TEmitter[' _emitType']
  >
> = keyof TEmitRecord | keyof TEventRecord;

export type OnEventNames<
  TEmitter extends TypeRecord<any, any, any>,
  TEventRecord extends NoUndefined<TEmitter[' _eventsType']> = NoUndefined<
    TEmitter[' _eventsType']
  >,
  TEmitRecord extends NoUndefined<TEmitter[' _emitType']> = NoUndefined<
    TEmitter[' _emitType']
  >
> = keyof TEventRecord;

export type EmitEventNames<
  TEmitter extends TypeRecord<any, any, any>,
  TEventRecord extends NoUndefined<TEmitter[' _eventsType']> = NoUndefined<
    TEmitter[' _eventsType']
  >,
  TEmitRecord extends NoUndefined<TEmitter[' _emitType']> = NoUndefined<
    TEmitter[' _emitType']
  >
> = keyof TEmitRecord;
