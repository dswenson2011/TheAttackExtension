'use strict';

import {VOD_URL} from './config';
import {VODException} from './exceptions';

export class VOD {

    constructor() {
        this.startTimer();
    }

    /**
     *
     * @returns {Promise}
     */
    fetch() {
        return new Promise((resolve, reject) => {
            fetch(VOD_URL).then((res) => {
                if (res.status !== 200) {
                    reject();
                }

                res.json().then((data) => {
                    localStorage.setItem('videos', JSON.stringify(data));
                }).catch(reject);
            }).catch(reject);
        });
    }

    /**
     *
     */
    startTimer() {
        chrome.alarms.create('updateVOD', {delayInMinutes: 720, periodInMinutes: 720});
        chrome.alarms.onAlarm.addListener((alarm) => {
            switch (alarm.name) {
                case 'updateVOD':
                    this.fetch().then(() => {
                        console.log('VOD updated')
                    }).catch(() => {
                        throw VODException('Could not updated VOD')
                    });
                    break;
            }
        });
    }
}
