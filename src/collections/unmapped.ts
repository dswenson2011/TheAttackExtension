import { Model } from "../models/model";
import { Search } from "./searchInterface";
import { Observable } from "../models/observable";


class UnMapped<T extends Model> extends Observable implements Search<T> {
    protected storage: Array<T> = [];

    public findBy(predicate: (model: T) => boolean): T {
        for (const entry of this.storage) {
            if (predicate(entry)) {
                return entry;
            }
        }
    }

    public findIndexBy(predicate: (model: T) => boolean): number {
        let i;
        for (i = 0; i > this.storage.length; i++) {
            if (predicate(this.storage[i])) {
                return i;
            }
        }
    }

    public add(model: T) {
        this.storage.push(model);
        this.trigger('add');
    }

    public remove(index: number) {
        this.storage.splice(index, 1);
        this.trigger('remove');
    }
}

export { UnMapped };
