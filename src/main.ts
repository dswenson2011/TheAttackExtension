declare const chrome: any;
declare const $: any;

import {EventInterface, Schedule} from "./models/schedule";
import {GoogleAnalytics} from "./models/googleanalytics";
import {status} from "./models/tab";
import {VODs} from "./collections/vods";
import {Tabs} from "./collections/tabs";
import {createLiveNotification} from "./utils";

$(document).ready(() => {
    const GA = new GoogleAnalytics();
    const schedule = new Schedule();
    const tabs = new Tabs();
    const vods = new VODs();

    schedule.register('eventLive', (key: string, event: EventInterface) => {
        let tab;

        if (tab = tabs.get(key)) {
            chrome.browserAction.setIcon({path: 'assets/icon/live.png'});
            createLiveNotification(`${event.title} is live. Opening new tab in 5 seconds`);
            setTimeout(() => {
                tab.open(event.url);
                GA.pageView(event.url);
                GA.event('Schedule Time', [event.url]);
            }, 5000);
        }
    });

    schedule.register('eventOver', () => {
        chrome.browserAction.setIcon({path: 'assets/icon/19.png'});
    });

    schedule.register('eventAdd', (key) => {
        tabs.new(key);
    });

    schedule.register('render', (entries) => {
        for (const [, event] of entries) {
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
    });

    // Register Chrome events
    chrome.tabs.onRemoved.addListener((id) => {
        let tab;
        if (tab = tabs.findBy(t => t.get('id') === id)) {
            const
                now = new Date().getTime(),
                open = new Date(tab.get('time')).getTime(),
                spent = Math.ceil((now - open) / 1000);

            GA.event('Duration Time', [`${spent}s`]);
            GA.event('Time Spent on Stream', ['On Link', 'Link', spent]);
            tab.set('status', status.CLOSED);
            tab.set('id', null);
            tab.set('time', null);
            tabs.update(tab);
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
                video = vods.findBy(v => v.get('id') === id);
            if (video) {
                let redirectURL = `${details.url}?t=${video.get('StartTime')}`;
                GA.pageView(redirectURL);
                GA.event('Redirection', [redirectURL]);
                chrome.tabs.update(details.tabId, {url: redirectURL});
            }
        }
    });

    // Fetch Schedule Data
    schedule.fetch().then(data => schedule.parse(data));

    // Fetch VOD data and parse the result
    vods.fetch().then(data => vods.parse(data));

    // Hide the content until after 200s due to chrome resizing bug
    // Can be fixed by implementing a loader and turning the schedule render into a resolving a promise
    // then executing this code block after the promise is resolved
    setTimeout(() => {
        const style = document.querySelector('.background')['style'];
        style.display = 'block';
        setTimeout(() => {
            style.opacity = 1;
        });
    }, 200);

    GA.event('Action', ['Attack Chrome Extension Start']);
});
