declare var chrome: any;

const DAY_MAP: Map<Number, string> = new Map<Number, string>([
    [1, "monday"],
    [2, "tuesday"],
    [3, "wednesday"],
    [4, "thursday"],
    [5, "friday"]
]);

const COMMENT_REGEX = /.+?(?=Monday|Tuesday|Wednesday|Thursday|Friday)/;

function createNotification(message: string, title: string = 'The Attack', icon: string = '128'): void {
    chrome.notifications.create('alert', {
        type: 'basic',
        iconUrl: `assets/icon/${icon}.png`,
        title: title,
        message: message
    });
}

function createLiveNotification(message: string, title: string = 'The Attack'): void {
    createNotification(message, title, 'live');
}

export { DAY_MAP, COMMENT_REGEX, createNotification, createLiveNotification };
