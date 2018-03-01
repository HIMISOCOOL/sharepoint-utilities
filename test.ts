/// <reference path="./src/index.d.ts" />
SP.SOD.import(['sp.js']).then(() => {
    const context = new SP.ClientContext();
    const web = context.get_web();
    const lists = web.get_lists();
    const list = lists.getByTitle('Documents');
    const items: SP.ListItemCollection = list.get_queryResult('<View></View>');
    context.load(items);
    context.executeQuery().then(() => {
        items.each((i, item) => {
            item.get_item('Title');
        });
        items.every((item, i, items) => item.get_item('Title') === '') ===
            false;
        items
            .find((item, i, items) => item.get_item('Title') === '')
            .get_item('Title');
        const filtered1: SP.ListItem[] = items.filter(
            item => item.get_item('Title') === ''
        );
        const filtered2: SP.ListItem[] = items.filter({
            Title: '',
            Author: web.get_currentUser()
        });
        items.firstOrDefault().get_item('Title');
        items.map((item, i) => item.get_item('Title')).length;
        items.some((item, i, items) => item.get_item('Title') === '') === false;
        items.toArray()[0].get_item('Title');
        const groups: { [group: string]: SP.ListItem[] } = items.groupBy(
            item => {
                return item.get_item('ContentType');
            }
        );
        const total_sum: number = items.reduce((sum, item) => {
            return sum + item.get_item('Total');
        },                                     0);
    });
    const guid = SP.Guid.generateGuid();
});
