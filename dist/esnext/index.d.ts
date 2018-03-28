/// <reference types="sharepoint" />
/// <reference types="jquery" />
/**
 * Converts a collection to a regular JS array.
 * @param {IEnumerable<T>} enumerable The Sharepoint enumerable to turn into an array.
 * @returns {T[]} The enumerable as an array
 */
export declare const toArray: <T>(enumerable: IEnumerable<T>) => T[];
declare const _default: {
    forEach: <T>(iteratee: (item: T, index?: number, collection?: IEnumerable<T>) => boolean | void, enumerable: IEnumerable<T>) => void;
    map: <T, TResult>(iteratee: (item: T, index?: number, coll?: IEnumerable<T>) => TResult, enumerable: IEnumerable<T>) => TResult[];
    toArray: <T>(enumerable: IEnumerable<T>) => T[];
    some: <T>(iteratee: (item: T, index?: number, collection?: IEnumerable<T>) => boolean | void, enumerable: IEnumerable<T>) => boolean;
    every: <T>(iteratee: (item: T, index?: number, collection?: IEnumerable<T>) => boolean | void, enumerable: IEnumerable<T>) => boolean;
    find: <T>(iteratee: (item: T, index?: number, collection?: IEnumerable<T>) => boolean | void, enumerable: IEnumerable<T>) => T;
    reduce: <T, TResult>(iteratee: (prev: TResult, curr: T, index: number, list: IEnumerable<T>) => TResult, accumulator: TResult, enumerable: IEnumerable<T>) => TResult;
    groupBy: <T>(iteratee: (value: T, index?: number, collection?: IEnumerable<T>) => string | number, enumerable: IEnumerable<T>) => {
        [group: string]: T[];
    };
    filter: <T>(predicate: string | string[] | {
        [prop: string]: any;
    } | ((item: T, index?: number, collection?: IEnumerable<T>) => boolean | void), enumerable: IEnumerable<T>) => T[];
    firstOrDefault: <T>(iteratee: (item: T, index?: number, collection?: IEnumerable<T>) => boolean | void, enumerable: IEnumerable<T>) => T;
    executeQuery$: <T>(context: SP.ClientContext, data: T) => JQueryPromise<T>;
    getQueryResult: (queryText: string, list: SP.List<any>) => SP.ListItemCollection<any>;
};
export default _default;
