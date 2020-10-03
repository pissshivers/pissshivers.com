import PissApp  from '..';

// export function ClassFactory<T>(c: new () => T, ...args: any[]): T {
//     return Object.assign( new c(), args);
//   }

export function PissClassFactory<T>(pissClass: { new(continer?: PissApp): T }, container?: PissApp): T {
  return new pissClass(container);
}