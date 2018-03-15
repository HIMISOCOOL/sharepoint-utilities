class ClientObjectCollection {
    each(callback) {
        return this.forEach((item, i) => {
            callback(i, item);
        });
    }
    forEach(iteratee) {
        let index = 0;
        const enumerator = this.getEnumerator();
        while (enumerator.moveNext()) {
            if (iteratee(enumerator.get_current(), index++, this) === false) {
                break;
            }
        }
    }
    map(iteratee) {
        let index = -1;
        const enumerator = this.getEnumerator();
        const result = [];
        while (enumerator.moveNext()) {
            result[++index] = iteratee(enumerator.get_current(), index, this);
        }
        return result;
    }
    toArray() {
        const collection = [];
        this.each((i, item) => {
            collection.push(item);
        });
        return collection;
    }
    some(iteratee) {
        let val = false;
        this.each((i, item) => {
            if (iteratee(item, i, this)) {
                val = true;
                return false;
            }
        });
        return val;
    }
    every(iteratee) {
        let val = true;
        let hasitems = false;
        this.each((i, item) => {
            hasitems = true;
            if (!iteratee(item, i, this)) {
                val = false;
                return false;
            }
        });
        return hasitems && val;
    }
    find(iteratee) {
        let val;
        this.each((i, item) => {
            if (iteratee(item, i, this)) {
                val = item;
                return false;
            }
        });
        return val;
    }
    reduce(iteratee, accumulator) {
        this.forEach((item, i) => {
            accumulator = iteratee(accumulator, item, i, this);
        });
        return accumulator;
    }
    groupBy(iteratee) {
        return this.reduce((result, value) => {
            const key = iteratee(value);
            if (Object.prototype.hasOwnProperty.call(result, key)) {
                result[key].push(value);
            }
            else
                result[key] = [value];
            return result;
        }, {});
    }
    matches(source) {
        return item => {
            for (const prop in source) {
                let compare_val = source[prop];
                let value;
                if (item instanceof SP.ListItem) {
                    value = item.get_item(prop);
                    if (value instanceof SP.FieldLookupValue ||
                        value instanceof SP.FieldUserValue) {
                        value = value.get_lookupId();
                        if (compare_val instanceof SP.User) {
                            compare_val = compare_val.get_id();
                        }
                        else if (compare_val instanceof SP.FieldLookupValue ||
                            compare_val instanceof SP.FieldUserValue) {
                            compare_val = compare_val.get_lookupId();
                        }
                    }
                    else if (value instanceof SP.FieldUrlValue) {
                        value =
                            value.get_url() + ';#' + value.get_description();
                        if (compare_val instanceof SP.FieldUrlValue) {
                            compare_val =
                                compare_val.get_url() +
                                    ';#' +
                                    compare_val.get_description();
                        }
                    }
                }
                else
                    value = item[prop];
                return value === compare_val;
            }
        };
    }
    property(props) {
        const properties = Array.isArray(props) ? props : [props];
        return item => {
            if (item instanceof SP.ListItem) {
                return properties.every(prop => item.get_item(prop));
            }
            return properties.every(prop => item[prop]);
        };
    }
    filter(predicate) {
        const predicateType = Object.prototype.toString.call(predicate);
        switch (predicateType) {
            case '[object Function]': {
                const items = [];
                const filter = predicate;
                this.forEach((item, i) => {
                    if (filter(item, i, this))
                        items.push(item);
                });
                return items;
            }
            case 'object':
                return this.filter(this.matches(predicate));
            case 'string':
            case '[object Array]':
                return this.filter(this.property(predicate));
        }
        return null;
    }
    firstOrDefault(iteratee) {
        let index = 0;
        const enumerator = this.getEnumerator();
        if (enumerator.moveNext()) {
            const current = enumerator.get_current();
            if (iteratee) {
                if (iteratee(current, index++, this))
                    return current;
            }
            else
                return current;
        }
        return null;
    }
}
let rejectionHandler;
export function registerUnhandledErrorHandler(handler) {
    rejectionHandler = handler;
}
class ClientContext {
    executeQuery() {
        const context = this;
        return new Promise((resolve, reject) => {
            context.executeQueryAsync((sender, args) => {
                resolve(args);
            }, (sender, args) => {
                reject(args);
            });
        }).catch((args) => {
            if (rejectionHandler)
                return rejectionHandler(args);
            return args;
        });
    }
}
class List {
    get_queryResult(queryText) {
        const query = new SP.CamlQuery();
        query.set_viewXml(queryText);
        return this.getItems(query);
    }
}
class Guid {
    static generateGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
}
let sodBaseAddress = null;
const getSodBaseAddress = function () {
    if (sodBaseAddress)
        return sodBaseAddress;
    if (_v_dictSod['sp.js'] && _v_dictSod['sp.js'].loaded) {
        sodBaseAddress = _v_dictSod['sp.js'].url.replace(/sp\.js(\?.+)?$/, '');
    }
    else {
        const scripts = document.getElementsByTagName('script');
        for (let s = 0; s < scripts.length; s++) {
            if (scripts[s].src && scripts[s].src.match(/\/sp\.js(\?.+)?$/)) {
                sodBaseAddress = scripts[s].src.replace(/sp\.js(\?.+)?$/, '');
                return sodBaseAddress;
            }
        }
        sodBaseAddress = '/_layouts/15/';
    }
    return sodBaseAddress;
};
const sodDeps = {};
export function registerSodDependency(sod, dep) {
    if (typeof dep === 'string') {
        if (_v_dictSod[sod]) {
            SP.SOD.registerSodDep(sod, dep);
            return;
        }
        if (!sodDeps[sod])
            sodDeps[sod] = [];
        sodDeps[sod].push(dep);
    }
    else {
        dep.map(d => registerSodDependency(sod, d));
    }
}
function importer(sod) {
    if (typeof sod === 'string') {
        const s = sod.toLowerCase();
        return new Promise((resolve, reject) => {
            if (!_v_dictSod[s] && s !== 'sp.ribbon.js') {
                SP.SOD.registerSod(s, getSodBaseAddress() + s);
                for (let d = 0; sodDeps[s] && d < sodDeps[s].length; d++) {
                    SP.SOD.registerSodDep(s, sodDeps[s][d]);
                }
            }
            SP.SOD.executeOrDelayUntilScriptLoaded(() => {
                resolve();
            }, s);
            SP.SOD.executeFunc(s, null, null);
        });
    }
    return Promise.all(sod.map(s => importSod(s)));
}
let spjs_loaded = false;
export function importSod(sod = 'sp.js') {
    if (sod === 'sp.js' && !spjs_loaded) {
        return importer(sod).then(() => {
            spjs_loaded = true;
            registerExtensions();
        });
    }
    return importer(sod);
}
function merge(obj, extension) {
    Object.getOwnPropertyNames(extension.prototype).forEach(name => {
        if (name !== 'constructor') {
            obj.prototype[name] = extension.prototype[name];
        }
    });
}
function registerExtensions() {
    merge(SP.ClientObjectCollection, ClientObjectCollection);
    merge(SP.ClientContext, ClientContext);
    merge(SP.List, List);
    merge(SP.Guid, Guid);
    SP.SOD['import'] = importSod;
}
export function register(log) {
    return importSod('sp.js').then(() => {
        if (log)
            console.log('SharePoint extensions loaded.');
    });
}
const SharepointUtilities = {
    registerUnhandledErrorHandler,
    registerSodDependency,
    importSod,
    register
};
export default SharepointUtilities;
