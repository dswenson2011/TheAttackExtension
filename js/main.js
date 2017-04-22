'use strict';

import {Schedule} from './schedule';
import {GoogleAnalytics} from './googleanalytics';
import {createNotification} from './utils';


// class Tabs {
//     constructor() {
//         this.cache = [];
//         chrome.tabs.onRemoved.addListener(this.onRemove);
//     }
//
//     onRemove(id) {
//         const
//             tab = this.cache.find(t => t.id === id),
//             now = new Date(),
//             open = new Date(this.cache[tab.index].time),
//             spent = Math.ceil((now - open) / 1000);
//
//         GoogleAnalytics.sendEvent('Duration Time', `${spent}s`);
//         GoogleAnalytics.sendEvent('Time Spent on Stream', ['On Link', 'Link', spent]);
//
//         this.cache[tab.index] = $.extend(tab, {id: null, time: null});
//     }
//
//     open(url, index) {
//         this.search(url).then().catch(() => {
//             chrome.tabs.create({url: url}, (tab) => {
//                 this.cache[index] = $.extend(this.cache[index] || {}, {
//                     id: tab.id,
//                     time: new Date().toISOString()
//                 });
//             });
//         });
//     }
//
//     search(url) {
//         return new Promise((resolve, reject) => {
//             chrome.tabs.query({}, (tabs) => {
//                 if (tabs.find(t => t.url === url)) {
//                     resolve();
//                 } else {
//                     reject();
//                 }
//             });
//         });
//     }
//
//     get(index) {
//         return this.cache[index];
//     }
//
//     set(index, data) {
//         this.cache[index] = data;
//     }
// }

// getCurrentEvent() {
//     if (weekday !== 7) {
//         for (let [key, event] of schedule.entries()) {
//             if (event.day === DAY_MAP[weekday]) {
//                 if (time >= event.start && time <= event.end) {
//                 }
//             }
// }

//
// const openTabs = new Tabs();
//
// fetch('').then((res) => {
//     if (res.status !== 200) {
//         console.log('Couldn\'t retrieve vods');
//         return;
//     }
//
//     res.json().then((data) => {
//         let videos = data['vodStartTimes'];
//         if (videos.length !== 0) {
//             localStorage.setItem('videos', JSON.stringify(videos));
//         }
//     });
// }).catch(() => {
//     console.log('Couldn\'t retrieve vods');
// });
//
// const checkTime = () => {
//     let
//         schedule = new Map(JSON.parse(localStorage.getItem('schedule')));
//
//     let
//         today = new Date(),
//         weekday = today.getUTCDay(),
//         time = today.toISOString().slice(10);
//
//     if (weekday !== 7) {
//         for (let [key, event] of schedule.entries()) {
//             if (event.day === DAY_MAP[weekday]) {
//                 if (time >= event.start && time <= event.end) {
//                     let index = openTabs.findIndex(t => t.id === key);
//                     if (!openTabs[index].openStatus) {
//                         createNotification(event.title);
//                         openTabs.get(index).openStatus = true;
//                         setTimeout(() => {
//                             GoogleAnalytics.sendView(event.url);
//                             GoogleAnalytics.sendEvent('Schedule Time', event.url);
//                             openTabs.open(event.url, index);
//                         }, 5000);
//                     }
//                 }
//             }
//         }
//
//         let
//             openTab = openTabs.find(t => t.openStatus === true),
//             icon = openTab ? 'live' : '19';
//
//         chrome.browserAction.setIcon({
//             path: `assets/icon/${icon}.png`
//         });
//     }
// };
//
// const updateSchedule = () => {
//     for (let i in DAY_MAP) {
//         $(`#${DAY_MAP[i]}-list`).empty();
//     }
//
//     initSchedule();
// };
//
// chrome.alarms.onAlarm.addListener((alarm) => {
//     switch (alarm.name) {
//         case 'checkTime':
//             checkTime();
//             break;
//         case 'updateSchedule':
//             updateSchedule();
//             break;
//     }
// });
//
// chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
//     let
//         prefix = 'https://www.twitch.tv/videos/';
//
//     if (details.url.indexOf(prefix) !== -1) {
//         let
//             videoID = details.url.substring(prefix.length, details.url.length),
//             videos = JSON.parse(localStorage.getItem('videos')),
//             video = videos.find(v => v['videoID'].toString() === videoID);
//
//         if (video) {
//             let
//                 redirectURL = `${details.url}?t=${video['videoStartTime']}`;
//
//             chrome.tabs.update(details.tabId, {url: redirectURL});
//             ga('send', 'pageview', redirectURL);
//             ga('send', 'event', 'Redirection', redirectURL);
//         }
//     }
// });
//
// chrome.runtime.onInstalled.addListener((details) => {
//     if (typeof ga === 'undefined') {
//         new GoogleAnalytics(CONFIG.GOOGLE_ANALYTIC_ID);
//     }
//
//     if (details.reason === 'install') {
//         GoogleAnalytics.sendEvent('Info', 'Attack Chrome Extension Installed');
//     } else if (details.reason === 'update') {
//         GoogleAnalytics.sendEvent('Info', 'Attack Chrome Extension Updated');
//     }
// });

$(document).ready(() => {
    const GA = new GoogleAnalytics();
    const schedule = new Schedule();
    schedule.fetch().then(() => {
        schedule.render();
    }).catch(() => {
        createNotification({message: 'Unable to fetch schedule'});
    });

    GA.event('Action', ['Attack Chrome Extension Start']);


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



