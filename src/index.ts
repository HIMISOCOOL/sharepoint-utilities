declare var NWF$: JQueryStatic;

type iterateeFunction<T> = (
    item: T,
    index?: number,
    collection?: IEnumerable<T>
) => boolean | void;
type filterPredicate<T> =
    | iterateeFunction<T>
    | { [prop: string]: any }
    | string
    | string[];

type groupIterateeFunction<T> = (
    value: T,
    index?: number,
    collection?: IEnumerable<T>
) => string | number;

// import { curry } from 'lodash-es';

/**
 * Execute a callback for every element in the matched set.
 * Returning false breaks out of the loop.
 * Returning "continue" skips to the end of current iteration.
 * @param iteratee The function that will called for each element,
 * and passed an index and the element itself
 * @param {IEnumerable<T>} enumerable The Sharepoint IEnumerable to be iterated over
 */
const forEach = <T>(
    iteratee: iterateeFunction<T>,
    enumerable: IEnumerable<T>
): void => {
    let index = 0;
    const enumerator = enumerable.getEnumerator();
    while (enumerator.moveNext()) {
        if (iteratee(enumerator.get_current(), index++, enumerable) === false) {
            break;
        }
    }
};

// export const forEach = curry<iterateeFunction<any>, IEnumerable<any>, void>(
//     forEachF
// );

/**
 * Creates an array of values by running each element in collection through iteratee.
 *
 * @param iteratee The function invoked per iteration.
 * @param {IEnumerable<T>} enumerable The Sharepoint IEnumerable that to be mapped
 * @return {TResult[]} Returns the new mapped array.
 */
const map = <T, TResult>(
    iteratee: (item: T, index?: number, coll?: IEnumerable<T>) => TResult,
    enumerable: IEnumerable<T>
): TResult[] => {
    let index = -1;
    const enumerator = enumerable.getEnumerator();
    const result = [];
    while (enumerator.moveNext()) {
        result[++index] = iteratee(enumerator.get_current(), index, enumerable);
    }
    return result;
};

// export const map = curry<
//     (item: any, index?: number, coll?: IEnumerable<any>) => any,
//     IEnumerable<any>,
//     any[]
// >(mapF);

/**
 * Converts a collection to a regular JS array.
 * @param {IEnumerable<T>} enumerable The Sharepoint enumerable to turn into an array.
 * @returns {T[]} The enumerable as an array
 */
export const toArray = <T>(enumerable: IEnumerable<T>): T[] => {
    const collection: T[] = [];
    forEach((item: T) => {
        collection.push(item);
    }, enumerable);
    return collection;
};

/**
 * Tests whether at least one element in the collection passes
 * the test implemented by the provided function.
 * @param iteratee Function to test for each element in the collection
 * @returns {boolean} true if the callback
 */
const some = <T>(
    iteratee: iterateeFunction<T>,
    enumerable: IEnumerable<T>
): boolean => {
    let val = false;
    forEach((item, i) => {
        if (iteratee(item, i, enumerable)) {
            val = true;
            return false;
        }
    }, enumerable);
    return val;
};

// export const some = curry<iterateeFunction<any>, IEnumerable<any>, boolean>(
//     someF
// );

/**
 * Tests whether all elements in the collection pass the test implemented by the provided function.
 * @param iteratee Function to test for each element in the collection
 * @returns {boolean} true if the callback
 */
const every = <T>(
    iteratee: iterateeFunction<T>,
    enumerable: IEnumerable<T>
): boolean => {
    let val = true;
    let hasitems = false;
    forEach((item, i) => {
        hasitems = true;
        if (!iteratee(item, i, enumerable)) {
            val = false;
            return false;
        }
    }, enumerable);
    return hasitems && val;
};

// export const every = curry<iterateeFunction<any>, IEnumerable<any>, boolean>(
//     everyF
// );

/**
 * Tests whether at least one element in the collection passes the test
 * implemented by the provided function.
 * @param iteratee Function to execute on each element in the collection
 * @returns {boolean} true if the callback
 */
const find = <T>(
    iteratee: iterateeFunction<T>,
    enumerable: IEnumerable<T>
): T => {
    let val: T;
    forEach((item, i) => {
        if (iteratee(item, i, enumerable)) {
            val = item;
            return false;
        }
    }, enumerable);
    return val;
};

// export const find = curry<iterateeFunction<any>, IEnumerable<any>, any>(findF);

/**
 * Reduces collection to a value which is the accumulated result of running each element in
 * collection thru iteratee, where each successive invocation is supplied the return value
 * of the previous.
 * The iteratee is invoked with four arguments: (accumulator, value, index|key, collection).
 * @param iteratee
 * @param accumulator
 * @param {IEnumerable<T>} enumerable
 */
const reduce = <T, TResult>(
    iteratee: (
        prev: TResult,
        curr: T,
        index: number,
        list: IEnumerable<T>
    ) => TResult,
    accumulator: TResult,
    enumerable: IEnumerable<T>
): TResult => {
    forEach((item, i) => {
        accumulator = iteratee(accumulator, item, i, enumerable);
    }, enumerable);
    return accumulator;
};

// export const reduce = curry<
//     (prev: any, curr: any, index: number, list: IEnumerable<any>) => any,
//     any,
//     IEnumerable<any>,
//     any
// >(reduceF);

/**
 * Creates an object composed of keys generated from the results of running each element of
 * collection thru iteratee. The order of grouped values is determined by the order they occur
 * in collection. The corresponding value of each key is an array of elements responsible for
 * generating the key. The iteratee is invoked with three arguments: (value, index, collection).
 * @param iteratee
 * @param {IEnumerable<T>} enumerable
 * @returns {{ [group: string]: SP.ListItem[] }}
 */
const groupBy = <T>(
    iteratee: groupIterateeFunction<T>,
    enumerable: IEnumerable<T>
): { [group: string]: T[] } => {
    return reduce(
        (result, value) => {
            const key = iteratee(value);
            if (Object.prototype.hasOwnProperty.call(result, key)) {
                result[key].push(value);
            } else result[key] = [value];
            return result;
        },
        {},
        enumerable
    );
};

// /**
//  * Creates an object composed of keys generated from the results of running each element of
//  * collection thru iteratee. The order of grouped values is determined by the order they occur
//  * in collection. The corresponding value of each key is an array of elements responsible for
//  * generating the key. The iteratee is invoked with three arguments: (value, index, collection).
//  * @param iteratee
//  * @param enumerable
//  */
// export const groupBy = curry<
//     groupIterateeFunction<any>,
//     IEnumerable<any>,
//     { [group: string]: any[] }
// >(groupByF);

const matches = <T>(
    source: { [prop: string]: any },
    enumerable: IEnumerable<T>
): iterateeFunction<T> => {
    return item => {
        for (const prop in <{ [prop: string]: any }>source) {
            let compare_val = source[prop];
            let value;
            if (item instanceof SP.ListItem) {
                value = item.get_item(prop);
                if (
                    value instanceof SP.FieldLookupValue ||
                    value instanceof SP.FieldUserValue
                ) {
                    value = value.get_lookupId();
                    if (compare_val instanceof SP.User) {
                        compare_val = compare_val.get_id();
                    } else if (
                        compare_val instanceof SP.FieldLookupValue ||
                        compare_val instanceof SP.FieldUserValue
                    ) {
                        compare_val = compare_val.get_lookupId();
                    }
                } else if (value instanceof SP.FieldUrlValue) {
                    value = value.get_url() + ';#' + value.get_description();
                    if (compare_val instanceof SP.FieldUrlValue) {
                        compare_val =
                            compare_val.get_url() +
                            ';#' +
                            compare_val.get_description();
                    }
                }
            } else value = item[prop];

            return value === compare_val;
        }
    };
};

const property = <T>(props: string | string[]): iterateeFunction<T> => {
    const properties: string[] = Array.isArray(props) ? props : [props];

    return item => {
        if (item instanceof SP.ListItem) {
            return properties.every(prop => item.get_item(prop));
        }
        return properties.every(prop => item[<string>prop]);
    };
};

/**
 * Iterates over elements of collection, returning an array of all
 * elements predicate returns truthy for.
 * The predicate is invoked with three arguments: (value, index|key, collection)
 * @param predicate
 * @param enumerable
 */
const filter = <T>(
    predicate: filterPredicate<T>,
    enumerable: IEnumerable<T>
): T[] => {
    const predicateType = Object.prototype.toString.call(predicate);
    switch (predicateType) {
        case '[object Function]': {
            const items: T[] = [];
            const filter = <iterateeFunction<T>>predicate;
            forEach((item, i) => {
                if (filter(item, i, enumerable)) items.push(item);
            }, enumerable);
            return items;
        }

        case 'object':
            return filter(
                matches(<{ [prop: string]: any }>predicate, enumerable),
                enumerable
            );

        case 'string':
        case '[object Array]':
            return filter(property(<string | string[]>predicate), enumerable);
    }
    return null;
};

// export const filter = curry<filterPredicate<any>, IEnumerable<any>, any[]>(
//     filterF
// );

/**
 * Returns the first element in the collection or null if none
 * @param iteratee A function to filter by
 * @param enumerable The Sharepoint Enumerable to run on
 * @return Returns the first item in the collection
 */
const firstOrDefault = <T>(
    iteratee: iterateeFunction<T>,
    enumerable: IEnumerable<T>
): T | null => {
    let index = 0;
    const enumerator = enumerable.getEnumerator();
    if (enumerator.moveNext()) {
        const current = enumerator.get_current();
        if (iteratee) {
            if (iteratee(current, index++, enumerable)) return current;
        } else return current;
    }
    return null;
};

// export const firstOrDefault = curry<
//     iterateeFunction<any>,
//     IEnumerable<any>,
//     any | null
// >(firstOrDefaultF);

/**
 * Executes the query loaded into the supplied client context via jquery promises.
 * Promise is resolved with `data` followed by the optional
 * `args` and `sender` of the succeed callback on the query.
 * If the promise is rejected the reject is invoked with the failed callback's `args` and `sender`
 * @param context the context to execute the query on.
 * @param data the object for the data being retrieved by the query,
 * to be passed to resolve the promise.
 */
const executeQuery$ = <T>(context: SP.ClientContext, data: T) => {
    const deferred = (NWF$ || $).Deferred<T>();
    context.executeQueryAsync(
        (sender, args) => deferred.resolve(data, args, sender),
        (sender, args) => deferred.reject(args, sender)
    );
    return deferred.promise();
};

// export const executeQuery$ = curry<SP.ClientContext, any, JQueryPromise<any>>(
//     executeQuery$F
// );

// /**
//  * A shorthand for context.executeQueryAsync except wrapped as a JS Promise object
//  * @param context the current Sharepoint Context
//  * @param rejectionHandler an optional rejectionHandler
//  */
// export const executeQuery = (
//     context: SP.ClientContext,
//     rejectionHandler?: (args: SP.ClientRequestFailedEventArgs) => Promise<any>
// ): Promise<any> => {
//     return new Promise<SP.ClientRequestSucceededEventArgs>(
//         (resolve, reject) => {
//             context.executeQueryAsync(
//                 (sender, args: SP.ClientRequestSucceededEventArgs) => {
//                     resolve(args);
//                 },
//                 (sender, args: SP.ClientRequestFailedEventArgs) => {
//                     reject(args);
//                 }
//             );
//         }
//     ).catch((args: SP.ClientRequestFailedEventArgs) => {
//         if (rejectionHandler) return rejectionHandler(args);
//         return args;
//     });
// };

/**
 * A shorthand to list.getItems with just the queryText and doesn't
 * require a SP.CamlQuery to be constructed
 * @param queryText the queryText to use for the query.set_ViewXml() call
 * @param list the list to execute the query on
 */
const getQueryResult = (
    queryText: string,
    list: SP.List
): SP.ListItemCollection => {
    const query = new SP.CamlQuery();
    query.set_viewXml(queryText);
    return list.getItems(query);
};

// export const getQueryResult = curry(getQueryResultF);

export default {
    forEach,
    map,
    toArray,
    some,
    every,
    find,
    reduce,
    groupBy,
    filter,
    firstOrDefault,
    executeQuery$,
    getQueryResult
};

// class Guid {
//     static generateGuid() {
//         return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
//             const r = (Math.random() * 16) | 0;
//             const v = c === 'x' ? r : (r & 0x3) | 0x8;
//             return v.toString(16);
//         });
//     }
// }
