'use strict';

const GOOGLE_ANALYTIC_ID = '';
const ATTACK_JSON_SCHEDULE = 'https://sixtysixten.com/jsonData/theAttackSchedule.json';
const ATTACK_JSON_VOD = 'https://sixtysixten.com/jsonData/theAttackVOD.json';
const DAY_MAP = {
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday"
};
const COMMENT_REGEX = /.+?(?=Monday|Tuesday|Wednesday|Thursday|Friday)/;

const openTabs = [];

const initAnalytics = () => {
    window['GoogleAnalyticsObject'] = 'ga';
    window['ga'] = window['ga'] || function () {
            (window['ga'].q = window['ga'].q || []).push(arguments);
        };
    window['ga'].l = 1 * new Date();

    let
        element = document.createElement('script'),
        parent = document.getElementsByTagName('script')[0];

    element.async = 1;
    element.src = 'https://www.google-analytics.com/analytics.js';
    parent.parentNode.insertBefore(element, null);

    ga('create', GOOGLE_ANALYTIC_ID, 'auto');
    ga('set', 'forceSSL', true);
    ga('set', 'checkProtocolTask', () => {
    });
    ga('require', 'displayfeatures');
};

const openNewTab = (url, index) => {
    chrome.tabs.query({}, (tabs) => {
        let
            exist = false;

        for (let tab of tabs) {
            if (tab.url === url) {
                exist = true;
                break;
            }
        }

        if (exist) {
            return;
        }

        chrome.tabs.create({url: url}, (tab) => {
            openTabs[index] = $.extend(openTabs[index], {
                tabID: tab.id,
                openTabTime: new Date().toISOString()
            });
        });
    });
};

const initSchedule = () => {
    fetch(ATTACK_JSON_SCHEDULE).then((res) => {
        if (res.status !== 200) {
            console.log('Couldn\'t update schedule.');
            return;
        }

        res.json().then((data) => {
            const filteredSchedule = new Map();

            for (let entry of data['schedule']) {
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

                    if (filteredSchedule.has(id)) {
                        event = {end: event.end};
                    }

                    filteredSchedule.set(id, $.extend(filteredSchedule.get(id) || {}, event));
                }
            }

            for (const [key, event] of filteredSchedule.entries()) {
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

                openTabs.push({
                    openStatus: false,
                    tabID: null,
                    openTabTime: null,
                    id: key
                });
            }

            localStorage.setItem('schedule', JSON.stringify([...filteredSchedule]));
        });
    }).catch(() => {
        console.log('Couldn\'t update schedule')
    });

    fetch(ATTACK_JSON_VOD).then((res) => {
        if (res.status !== 200) {
            console.log('Couldn\'t retrieve vods');
            return;
        }

        res.json().then((data) => {
            let videos = data['vodStartTimes'];
            if (videos.length !== 0) {
                localStorage.setItem('videos', JSON.stringify(videos));
            }
        });
    }).catch(() => {
        console.log('Couldn\'t retrieve vods');
    });
};

const createNotification = (title) => {
    chrome.notifications.create('alert', {
        type: 'basic',
        iconUrl: 'assets/icon/live.png',
        title: 'The Attack',
        message: `${title} has started. Opening new tab in 5 seconds.`
    }, (notificationId) => {
    });
};

const checkTime = () => {
    let
        schedule = new Map(JSON.parse(localStorage.getItem('schedule')));

    let
        today = new Date(),
        weekday = today.getUTCDay(),
        time = today.toISOString().slice(10);

    if (weekday !== 7) {
        for (let [key, event] of schedule.entries()) {
            if (event.day === DAY_MAP[weekday]) {
                if (time >= event.start && time <= event.end) {
                    let index = openTabs.findIndex(t => t.id === key);
                    if (!openTabs[index].openStatus) {
                        createNotification(event.title);
                        openTabs[index].openStatus = true;
                        setTimeout(() => {
                            ga('send', 'pageview', event.url);
                            ga('send', 'event', 'Schedule Time', event.url);
                            openNewTab(event.url, index);
                        }, 5000);
                    }
                }
            }
        }

        let
            openTab = openTabs.find(t => t.openStatus === true),
            icon = openTab ? 'live' : '19';

        chrome.browserAction.setIcon({
            path: `assets/icon/${icon}.png`
        });
    }
};

const updateSchedule = () => {
    for (let i in DAY_MAP) {
        $(`#${DAY_MAP[i]}-list`).empty();
    }

    initSchedule();
};

chrome.alarms.onAlarm.addListener((alarm) => {
    switch (alarm.name) {
        case 'checkTime':
            checkTime();
            break;
        case 'updateSchedule':
            updateSchedule();
            break;
    }
});

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    let
        prefix = 'https://www.twitch.tv/videos/';

    if (details.url.indexOf(prefix) !== -1) {
        let
            videoID = details.url.substring(prefix.length, details.url.length),
            videos = JSON.parse(localStorage.getItem('videos')),
            video = videos.find(v => v['videoID'].toString() === videoID);

        if (video) {
            let
                redirectURL = `${details.url}?t=${video['videoStartTime']}`;

            chrome.tabs.update(details.tabId, {url: redirectURL});
            ga('send', 'pageview', redirectURL);
            ga('send', 'event', 'Redirection', redirectURL);
        }
    }
});

chrome.tabs.onRemoved.addListener((tabID) => {
    let
        index = openTabs.findIndex(t => t.tabID === tabID),
        now = new Date(),
        open = new Date(openTabs[index].openTabTime),
        spent = Math.ceil((now - open) / 1000);

    ga('send', 'event', 'Duration Time', `${spent}s`);
    ga('send', 'event', 'Time Spent on Stream', 'On Link', 'Link', spent);

    openTabs[index] = $.extend(openTabs[index], {
        tabID: null,
        openTabTime: null
    });
});

chrome.runtime.onInstalled.addListener((details) => {
    if (typeof ga === 'undefined') {
        initAnalytics();
    }

    if (details.reason === 'install') {
        ga('send', 'event', 'Info', 'Attack Chrome Extension Installed');
    } else if (details.reason === 'update') {
        ga('send', 'event', 'Info', 'Attack Chrome Extension Updated');
    }
});

$(document).ready(() => {
    initAnalytics();
    ga('send', 'event', 'Action', 'Attack Chrome Extension Start');
    initSchedule();

    chrome.alarms.create('checkTime', {delayInMinutes: 0.5, periodInMinutes: 0.5});
    chrome.alarms.create('updateSchedule', {delayInMinutes: 720, periodInMinutes: 720});

    setTimeout(() => {
        const style = document.querySelector('.background').style;
        style.display = 'block';
        setTimeout(() => {
            style.opacity = 1;
        });
    }, 200);
});
