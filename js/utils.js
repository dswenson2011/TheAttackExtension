'use strict';

const DAY_MAP = {
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday"
};

const COMMENT_REGEX = /.+?(?=Monday|Tuesday|Wednesday|Thursday|Friday)/;

const createNotification = ({title = 'The Attack', message, icon = '128'}) => {
    chrome.notifications.create('alert', {
        type: 'basic',
        iconUrl: `assets/icon/${icon}.png`,
        title: title,
        message: message
    });
};

const createLiveNotification = ({title = 'The Attack', message}) => {
    createNotification({title: title, message: message, icon: 'live'});
};

export {DAY_MAP, COMMENT_REGEX, createNotification, createLiveNotification};
