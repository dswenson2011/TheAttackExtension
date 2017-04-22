export class Tabs {
    constructor() {
        this.storage = new Map();
    }

    /**
     *
     * @param {string} index
     * @returns {boolean}
     */
    isOpen(index) {
        return this.storage.get(index).open;
    }

    /**
     *
     * @param {string} index
     */
    add(index) {
        this.storage.set(index, {
            open: false,
            id: null,
            time: null,
        });
    }

    /**
     *
     * @param {string} url
     * @param {string} index
     */
    open(url, index) {
        chrome.tabs.query({}, (tabs) => {
            if (tabs.find(t => t.url === url)) {
                return;
            }

            chrome.tabs.create({url: url}, (tab) => {
                this.storage.set(index, {
                    open: true,
                    id: tab.id,
                    time: new Date().toISOString()
                });
            });
        });
    }
}
