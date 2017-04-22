'use strict';

import {createNotification} from './utils';

/**
 * Google Analytics Exception
 * @param {string} message
 * @constructor
 */
const GoogleAnalyticsException = (message) => {
    this.message = message;
    this.name = 'GoogleAnalyticsException';
};

/**
 * Schedule Exception
 * @param {string} message
 * @constructor
 */
const ScheduleException = (message) => {
    this.message = message;
    this.name = 'ScheduleException';
    createNotification({message: message});
};

/**
 *
 * @param {string} message
 * @constructor
 */
const VODException = (message) => {
    this.message = message;
    this.name = 'VODException';
    createNotification({message: message})
};

export {GoogleAnalyticsException, ScheduleException, VODException};
