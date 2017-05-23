declare var chrome: any;

import { Model } from './model';

enum status {
    OPEN,
    CLOSED
}

class Tab extends Model {

    private status: status;
    private id: Number | null;
    private time: string | null;

    constructor() {
        super()
        this.status = status.CLOSED;
    }

    public isOpen() {
        return this.status == status.OPEN;
    }

    public open(url: string) {
        chrome.tabs.query({}, (tab) => {
            this.time = new Date().toUTCString();
            this.id = tab.id;
            this.status = status.OPEN;
        });
    }
}

export { Tab, status };
