import { ObserverException } from "../exceptions";
import { Observer } from "../interfaces/observer";


class Observable {

    private observers: Map<string, Array<Observer>>;

    public constructor() {
        this.observers = new Map<string, Array<Observer>>();
    }

    public register(channel: string, callback: Observer): void {
        let array: Array<Observer> = !this.observers.has(channel) ? [] : this.observers.get(channel);

        array.push(callback);
        this.observers.set(channel, array);
    }

    public trigger(channel: string, data: Array<any> = []): void {
        if (!this.observers.has(channel)) {
            throw new ObserverException('Channel does not exist');
        }

        this.observers.get(channel).forEach(cb => cb(...data));
    }
}

export { Observable };
