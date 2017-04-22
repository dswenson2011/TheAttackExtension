'use strict';

/**
 * Google Analytics Exception
 * @param message
 * @constructor
 */
const GoogleAnalyticsException = (message) => {
    this.message = message;
    this.name = 'GoogleAnalyticsException';
};

export {GoogleAnalyticsException};
