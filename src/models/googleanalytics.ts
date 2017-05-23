declare const ga: any;

import { config } from '../config';
import { GoogleAnalyticsException } from "../exceptions";

export class GoogleAnalytics {
    id: string = config.google.analytic_id;
    private injected: boolean = false;
    private initialized: boolean = false;

    constructor() {
        this.inject();
        this.initialize();
    }

    private inject(): void {
        if (this.injected) {
            throw new GoogleAnalyticsException('Google Analytics has already been injected');
        }

        window['GoogleAnalyticsObject'] = 'ga';
        window['ga'] = window['ga'] || function () {
            (window['ga'].q = window['ga'].q || []).push(arguments);
        }
        window['ga'].l = 1 * new Date().getTime();

        let element: Element = document.createElement('script');
        let parent: Element = document.getElementsByTagName('script')[0];

        element['async'] = 1;
        element['src'] = 'https://www.google-analytics.com/analytics.js';

        parent.parentNode.insertBefore(element, null);
        this.injected = true;
    }

    private initialize(): void {
        if (this.initialized) {
            throw new GoogleAnalyticsException('Google Analytics has already been initialized');
        }

        ga('create', this.id, 'auto');
        ga('set', 'forceSSL', true);
        ga('set', 'checkProtocolTask', null);
        ga('require', 'displayfeatures');
        this.initialized = true;
    }

    private checkStatus(): void {
        if (!this.injected && !this.initialized) {
            throw new GoogleAnalyticsException('Attempted to use Google Analytics before injection or initialization');
        }
    }

    public event(name: string, data: Array<any>): void {
        this.checkStatus();
        ga('send', 'event', name, ...data);
    }

    public pageView(url: string): void {
        this.checkStatus();
        ga('send', 'pageView', url);
    }
}
