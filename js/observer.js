'use strict';

export class Observer {

    constructor() {
        this.observers = {};
    }

    /**
     * Register observers
     * @param {string} channel - channel to observe
     * @param cb
     */
    register(channel, cb) {
        if (!this.observers.hasOwnProperty(channel)) {
            this.observers[channel] = [];
        }

        this.observers[channel].push(cb);
    }

    /**
     * Trigger  channel and send data
     * @param {string} channel
     * @param {Array} data
     */
    trigger(channel, data) {
        if (!this.observers.hasOwnProperty(channel)) {
            return;
        }

        this.observers[channel].forEach(cb => cb(...data));
    }
}
