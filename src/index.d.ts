/// <reference types="sharepoint" />
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

declare interface SharepointUtilities {
    /**
     * Execute a callback for every element in the matched set.
     * Returning false breaks out of the loop.
     * Returning "continue" skips to the end of current iteration.
     * @param iteratee The function that will called for each element,
     * and passed an index and the element itself
     * @param enumerable The Sharepoint IEnumerable to be iterated over
     */
    forEach<T>(iteratee: iterateeFunction<T>, enumerable: IEnumerable<T>): void;

    /**
     * @see forEach
     */
    forEach<T>(
        iteratee: iterateeFunction<T>
    ): (enumerable: IEnumerable<T>) => void;

    /**
     * Creates an array of values by running each element in collection through iteratee.
     *
     * @param iteratee The function invoked per iteration.
     * @param enumerable The Sharepoint IEnumerable that to be mapped
     * @return Returns the new mapped array.
     */
    map<T, TResult>(
        iteratee: (item: T, index?: number, coll?: IEnumerable<T>) => TResult,
        enumerable: IEnumerable<T>
    ): TResult[];

    /**
     * @see map
     */
    map<T, TResult>(
        iteratee: (item: T, index?: number, coll?: IEnumerable<T>) => TResult
    ): (enumerable: IEnumerable<T>) => TResult[];

    /**
     * Converts a collection to a regular JS array.
     * @param enumerable The Sharepoint enumerable to turn into an array.
     * @returns The enumerable as an array
     */
    toArray: <T>(enumerable: IEnumerable<T>) => T[];

    /**
     * Tests whether at least one element in the collection passes
     * the test implemented by the provided function.
     * @param iteratee Function to test for each element in the collection
     * @returns true if the callback
     */
    some<T>(iteratee: iterateeFunction<T>, enumerable: IEnumerable<T>): boolean;

    /**
     * @see some
     */
    some<T>(
        iteratee: iterateeFunction<T>
    ): (enumerable: IEnumerable<T>) => boolean;

    /**
     * Tests whether all elements in the collection pass the test implemented by the provided function.
     * @param {iterateeCallback} iteratee Function to test for each element in the collection
     * @returns true if the callback
     */
    every<T>(
        iteratee: iterateeFunction<T>,
        enumerable: IEnumerable<T>
    ): boolean;

    /**
     * @see find
     */
    every<T>(
        iteratee: iterateeFunction<T>
    ): (enumerable: IEnumerable<T>) => boolean;

    /**
     * Tests whether at least one element in the collection passes the test
     * implemented by the provided function.
     * @param {iterateeCallback} iteratee Function to execute on each element in the collection
     * @returns true if the callback
     */
    find<T>(iteratee: iterateeFunction<T>, enumerable: IEnumerable<T>): T;

    /**
     * @see find
     */
    find<T>(iteratee: iterateeFunction<T>): (enumerable: IEnumerable<T>) => T;

    /**
     * Reduces collection to a value which is the accumulated result of running each element in
     * collection thru iteratee, where each successive invocation is supplied the return value
     * of the previous.
     * The iteratee is invoked with four arguments: (accumulator, value, index|key, collection).
     * @param iteratee
     * @param accumulator
     * @param enumerable
     */
    reduce<T, TResult>(
        iteratee: (
            prev: TResult,
            curr: T,
            index: number,
            list: IEnumerable<T>
        ) => TResult
    ): (accumulator: TResult, enumerable: IEnumerable<T>) => TResult;

    /**
     * @see reduce
     */
    reduce<T, TResult>(
        iteratee: (
            prev: TResult,
            curr: T,
            index: number,
            list: IEnumerable<T>
        ) => TResult,
        accumulator: TResult
    ): (enumerable: IEnumerable<T>) => TResult;

    /**
     * @see reduce
     */
    reduce<T, TResult>(
        iteratee: (
            prev: TResult,
            curr: T,
            index: number,
            list: IEnumerable<T>
        ) => TResult
    ): (accumulator: TResult) => (enumerable: IEnumerable<T>) => TResult;

    /**
     * Creates an object composed of keys generated from the results of running each element of
     * collection thru iteratee. The order of grouped values is determined by the order they occur
     * in collection. The corresponding value of each key is an array of elements responsible for
     * generating the key. The iteratee is invoked with three arguments: (value, index, collection).
     * @param iteratee
     * @param enumerable
     */
    groupBy<T>(
        iteratee: (
            value: T,
            index?: number,
            collection?: IEnumerable<T>
        ) => string | number,
        enumerable: IEnumerable<T>
    ): { [group: string]: T[] };

    /**
     * @see groupBy
     */
    groupBy<T>(
        iteratee: (
            value: T,
            index?: number,
            collection?: IEnumerable<T>
        ) => string | number
    ): (enumerable: IEnumerable<T>) => { [group: string]: T[] };

    /**
     * Iterates over elements of collection, returning an array of all
     * elements predicate returns truthy for.
     * The predicate is invoked with three arguments: (value, index|key, collection)
     * @param predicate
     * @param enumerable
     */
    filter<T>(predicate: filterPredicate<T>, enumerable: IEnumerable<T>): T[];

    /**
     * @see filter
     */
    filter<T>(
        predicate: filterPredicate<T>
    ): (enumerable: IEnumerable<T>) => T[];

    /**
     * Returns the first element in the collection or null if none
     * @param iteratee A function to filter by
     * @param enumerable The Sharepoint Enumerable to run on
     * @return Returns the first item in the collection
     */
    firstOrDefault<T>(
        iteratee: iterateeFunction<T>,
        enumerable: IEnumerable<T>
    ): T | null;

    /**
     * @see firstOrDefault
     */
    firstOrDefault<T>(
        iteratee: iterateeFunction<T>
    ): (enumerable: IEnumerable<T>) => T | null;

    // /**
    //  * A shorthand for context.executeQueryAsync except wrapped as a JS Promise object
    //  * @param context the current Sharepoint Context
    //  * @param rejectionHandler an optional rejectionHandler
    //  */
    // executeQuery: (
    //     context: SP.ClientContext,
    //     rejectionHandler?: (
    //         args: SP.ClientRequestFailedEventArgs
    //     ) => Promise<any>
    // ) => Promise<any>;

    /**
     * Executes the query loaded into the supplied client context via jquery promises.
     * Promise is resolved with `data` followed by the optional 
     * `args` and `sender` of the succeed callback on the query.
     * If the promise is rejected the reject is invoked with the failed callback's `args` and `sender`
     * @param context the context to execute the query on.
     * @param data the object for the data being retrieved by the query,
     * to be passed to resolve the promise.
     */
    executeQuery$<T>(context: SP.ClientContext, data: T): JQueryPromise<T>;

    /**
     * @see executeQuery$
     */
    executeQuery$<T>(context: SP.ClientContext): (data: T) => JQueryPromise<T>;

    /**
     * A shorthand to list.getItems with just the queryText and doesn't
     * require a SP.CamlQuery to be constructed
     * @param queryText the queryText to use for the query.set_ViewXml() call
     * @param list the list to execute the query on
     */
    getQueryResult(queryText: string, list: SP.List): SP.ListItemCollection;

    /**
     * @see getQueryResult
     */
    getQueryResult(queryText: string): (list: SP.List) => SP.ListItemCollection;
}

export default SharepointUtilities;
