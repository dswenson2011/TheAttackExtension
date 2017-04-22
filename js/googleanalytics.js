import {GOOGLE_ANALYTIC_ID} from './config';
import {GoogleAnalyticsException} from './exceptions';

export class GoogleAnalytics {
    constructor() {
        this.id = GOOGLE_ANALYTIC_ID;
        this.injected = false;
        this.initialized = false;

        this.inject();
        this.initialize();
    }

    /**
     * Inject Google Analytics script into the HTML
     */
    inject() {
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
        this.injected = true;
    }

    /**
     * Initialize the Google Analytic settings
     */
    initialize() {
        ga('create', this.id, 'auto');
        ga('set', 'forceSSL', true);
        ga('set', 'checkProtocolTask', null);
        ga('require', 'displayfeatures');
        this.initialized = true;
    }

    /**
     * Check injection
     * @throws {GoogleAnalyticsException} - will be thrown if not injected or initialized
     */
    checkStatus() {
        if (!this.injected || !this.initialized) {
            throw GoogleAnalyticsException('Attempted to use ga before being injected or initialized');
        }
    }

    /**
     * Send event to Google Analytic
     * @param {string} name - Event name to be sent
     * @param {Array} data - Array of data to be spread
     */
    event(name, data) {
        this.checkStatus();
        ga('send', 'event', name, ...data);
    }

    /**
     * Send pageview to Google Analytic
     * @param {string} url - URL to be recorded in pageview send
     */
    pageView(url) {
        this.checkStatus();
        ga('send', 'pageview', url);
    }
}