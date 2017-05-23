import { Mapped } from "./mapped";
import { Tab } from "../models/tab";


class Tabs extends Mapped<Tab> {

    constructor() {
        super();
        this.storage = new Map<string, Tab>();
    }

    public new(key: string) {
        this.storage.set(key, new Tab());
    }

    public update(model: Tab) {
        let index = this.findIndexBy((e) => e.get('id') === model.get('id'));
        this.storage.set(index, model);
    }
}

export { Tabs }
