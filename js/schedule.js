'use strict';

import * as $ from 'jquery';
import {SCHEDULE_URL} from './config';
import {DAY_MAP, COMMENT_REGEX} from './utils';

export class Schedule {
    constructor() {
        this.storage = new Map();
    }

    /**
     * Render the schedule into the UI
     */
    render() {
        for (const [key, event] of this.storage.entries()) {
            const
                currentDate = /.+?(?=T)/.exec(new Date().toISOString())[0],
                start = new Date(currentDate + event.start).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                end = new Date(currentDate + event.end).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                });

            let listItem = document.createElement('li');
            listItem.innerText = `${event.title} ${start} - ${end}`;
            $(`#${event.day}-list`).append(listItem);
        }
    }

    /**
     * Fetch the schedule JSON from the configured URL
     * @returns {Promise}
     */
    fetch() {
        return new Promise((resolve, reject) => {
            fetch(SCHEDULE_URL).then((res) => {
                if (res.status !== 200) {
                    reject();
                }

                res.json().then((data) => {
                    this.parse(data);
                    resolve();
                }).catch(() => {
                    reject();
                });
            }).catch(() => {
                reject();
            });
        });
    }

    /**
     * Parse the retrieved JSON into the schedule map
     * @param {Object} data - Object which has an array called schedule
     */
    parse(data) {
        for (const entry of data['schedule']) {
            if (entry['trueDay'] in DAY_MAP) {
                let
                    event = {
                        title: COMMENT_REGEX.exec(entry['comment'])[0].trim(),
                        day: DAY_MAP[entry['trueDay']],
                        url: entry['link'],
                        start: entry['startTime'],
                        end: entry['endTime']
                    },
                    id = event.title.replace(/\s/g, '') + event.day;

                if (this.storage.has(id)) {
                    event = {end: event.end};
                }

                this.storage.set(id, $.extend(this.storage.get(id) || {}, event));
            }
        }

        this.persist();
    }

    /**
     * Persist the schedule map into localStorage
     */
    persist() {
        localStorage.setItem('schedule', JSON.stringify([...this.storage]));
    }

    /**
     * Retrieve from the localStorage and rebuild the schedule map
     */
    retrieve() {
        this.storage = new Map(JSON.parse(localStorage.getItem('schedule')));
    }
}
