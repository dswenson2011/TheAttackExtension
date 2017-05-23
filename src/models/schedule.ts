declare const chrome: any;

import { config } from '../config';
import { DAY_MAP, COMMENT_REGEX } from '../utils';
import { ScheduleException } from '../exceptions';
import { Observable } from "./observable";

interface EventInterface {
    title: string;
    day: string;
    url: string;
    start: string;
    end: string;
}

class Schedule extends Observable {

    private storage: Map<string, EventInterface> = new Map<string, EventInterface>();

    constructor() {
        super();
        this.startTimers();
    }

    public fetch() {
        return new Promise((resolve, reject) => {
            fetch(config.urls.schedule).then((res) => {
                if (!res.ok) {
                    reject();
                }

                res.json().then((data) => {
                    resolve(data);
                }).catch(reject);
            }).catch(() => {
                this.trigger('render', [this.retrieve()]);
            });
        });
    }

    public parse(data: any) {
        for (const entry of data['schedule']) {
            if (DAY_MAP.has(entry['trueDay'])) {
                let event: EventInterface = {
                    title: COMMENT_REGEX.exec(entry['comment'])[0].trim(),
                    day: DAY_MAP.get(entry['trueDay']),
                    url: entry['link'],
                    start: entry['startTime'],
                    end: entry['endTime']
                };
                let id = event.title.replace(/\s/g, '') + event.day;

                let originalEvent: EventInterface;
                if (this.storage.has(id)) {
                    originalEvent = this.storage.get(id);
                    originalEvent.end = event.end;
                } else {
                    originalEvent = event;
                }

                this.storage.set(id, originalEvent);
                this.trigger('eventAdd', [id]);
            }
        }
        this.trigger('render', [this.storage.entries()]);
        this.persist();
    }

    public persist() {
        localStorage.setItem('schedule', JSON.stringify([...this.storage]));
    }

    public retrieve() {
        const data = localStorage.getItem('schedule');

        if (data == null) {
            throw new ScheduleException('Unable to retrieve schedule from local storage');
        }

        this.storage = new Map<string, EventInterface>(JSON.parse(data));

        return this.storage.entries();
    }

    private getCurrentEvent(day: Number) {
        if (day !== 7) {
            const time = new Date().toISOString().slice(10);

            for (let [key, event] of this.storage.entries()) {
                if (event.day === DAY_MAP.get(day)) {
                    if (time >= event.start && time <= event.end) {
                        return {key: key, event: event};
                    }
                }
            }
        }

        return {key: null, event: null};
    }

    private startTimers() {
        chrome.alarms.create('checkTime', {delayInMinutes: 0.5, periodInMinutes: 0.5});
        chrome.alarms.create('updateSchedule', {delayInMinutes: 720, periodInMinutes: 720});

        chrome.alarms.onAlarm.addListener((alarm) => {
            switch (alarm.name) {
                case 'checkTime':
                    const {key, event} = this.getCurrentEvent(new Date().getDay());
                    if (key && event) {
                        this.trigger('eventLive', [key, event]);
                    } else {
                        this.trigger('eventOver');
                    }
                    break;
                case 'updateSchedule':
                    this.fetch().then(data => this.parse(data));
            }
        });
    }
}

export { EventInterface, Schedule };
