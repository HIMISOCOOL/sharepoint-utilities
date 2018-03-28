import {
    map,
    some,
    toArray,
    groupBy,
    reduce,
    getQueryResult,
    executeQuery$,
    forEach,
    every,
    find,
    filter,
    firstOrDefault
} from './';
const context1 = new SP.ClientContext();
const web = context1.get_web();
const lists = web.get_lists();
const list = lists.getByTitle('Documents');
const items: SP.ListItemCollection = getQueryResult('<View></View>', list);
context1.load(items);
executeQuery$(context1, items).then(() => {
    forEach((item, i) => {
        item.get_item('Title');
    }, items);
    every((item, i, items) => item.get_item('Title') === '', items) === false;

    find((item, i, items) => item.get_item('Title') === '', items).get_item(
        'Title'
    );
    const filtered1: SP.ListItem[] = filter(
        item => item.get_item('Title') === '',
        items
    );
    const filtered2: SP.ListItem[] = filter(
        {
            Title: '',
            Author: web.get_currentUser()
        },
        items
    );
    firstOrDefault(() => true, items).get_item('Title');
    map((item, i) => item.get_item('Title'), items).length;
    some((item, i, items) => item.get_item('Title') === '', items) === false;
    toArray(items)[0].get_item('Title');
    const groups: { [group: string]: SP.ListItem[] } = groupBy(item => {
        return item.get_item('ContentType');
    }, items);
    const total_sum: number = reduce(
        (sum, item) => {
            return sum + item.get_item('Total');
        },
        0,
        items
    );
}).fail(console.log);
// const guid = SP.Guid.generateGuid();
