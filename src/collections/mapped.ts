import { Model } from "../models/model";
import { Search } from "./searchInterface";
import { Observable } from "../models/observable";


class Mapped<T extends Model> extends Observable implements Search<T> {
    protected storage: Map<string, T>;

    public findBy(predicate: (model: T) => Boolean): T {
        for (const entry of this.storage.values()) {
            if (predicate(entry)) {
                return entry;
            }
        }
    }

    public findIndexBy(predicate: (model: T) => Boolean): string {
        for (const [index, entry] of this.storage.entries()) {
            if (predicate(entry)) {
                return index;
            }
        }
        return;
    }

    public set(key: string, value: T) {
        this.storage.set(key, value);
        this.trigger('add');
    }

    public get(key: string): T {
        return this.storage.get(key);
    }

    public remove(key: string) {
        this.storage.delete(key);
        this.trigger('remove');
    }

    public getAll(): IterableIterator<[string, T]> {
        return this.storage.entries();
    }
}

export { Mapped };
