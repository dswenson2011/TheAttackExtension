'use strict';

import {Schedule} from './schedule';
import {Tabs} from './tabs';
import {VOD} from './vod';
import {GoogleAnalytics} from './googleanalytics';
import {createLiveNotification} from './utils';


$(document).ready(() => {
    const GA = new GoogleAnalytics();
    const schedule = new Schedule();
    const tabs = new Tabs();
    const vod = new VOD();

    // Register events
    schedule.register('eventLive', (key, event) => {
        if (!tabs.isOpen(key)) {
            chrome.browserAction.setIcon({path: 'assets/icon/live.png'});
            createLiveNotification({message: `${event.title} is live. Opening new tab in 5 seconds`});
            setTimeout(() => {
                tabs.open(event.url, key);
                GA.pageView(event.url);
                GA.event('Schedule Time', [event.url]);
            }, 5000);
        }
    });

    schedule.register('eventOver', () => {
        chrome.browserAction.setIcon({path: 'assets/icon/19.png'});
    });

    schedule.register('eventAdd', (key) => {
        tabs.add(key);
    });

    // Fetch Data
    schedule.fetch().then(() => {
        schedule.render();
    }).catch(() => {
        schedule.retrieve();
        schedule.render();
    });

    schedule.startTimers();

    vod.fetch().then(() => {
    }).catch(() => {
    });

    // Register Chrome events
    chrome.tabs.onRemoved.addListener((id) => {
        for (const {index, tab} of tabs.storage.entries()) {
            if (tab.id === id) {
                const
                    now = new Date(),
                    open = new Date(tab.time),
                    spent = Math.ceil((now - open) / 1000);

                GA.event('Duration Time', [`${spent}s`]);
                GA.event('Time Spent on Stream', ['On Link', 'Link', spent]);
                tab.open = false;
                tab.id = null;
                tab.time = null;
                tabs.storage.set(index, tab);
            }
        }
    });

    chrome.runtime.onInstalled.addListener((details) => {
        let message = '';
        switch (details.reason) {
            case 'install':
                message = 'Attack Chrome Extension Installed';
                break;
            case 'update':
                message = 'Attack Chrome Extension Updated';
                break;
        }

        GA.event('Info', [message]);
    });


    chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
        const prefix_url = "https://www.twitch.tv/videos/";
        if (details.url.indexOf(prefix_url) !== -1) {
            let
                id = details.url.substring(prefix_url.length, details.url.length),
                videos = JSON.parse(localStorage.getItem('videos'))['vodStartTimes'],
                video = videos.find(v => v['videoID'].toString() === id);
            if (video) {
                let redirectURL = `${details.url}?t=${video['videoStartTime']}`;
                GA.pageView(redirectURL);
                GA.event('Redirection', [redirectURL]);
                chrome.tabs.update(details.tabId, {url: redirectURL});
            }
        }
    });

    setTimeout(() => {
        const style = document.querySelector('.background').style;
        style.display = 'block';
        setTimeout(() => {
            style.opacity = 1;
        });
    }, 200);

    GA.event('Action', ['Attack Chrome Extension Start']);
});
