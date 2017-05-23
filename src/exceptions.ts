import { createNotification } from "./utils";

class Exception {
    public message: string;
    public name: string;

    constructor(message: string) {
        this.message = message;
    }

    public toString(): string {
        return `${this.name} - ${this.message}`;
    }
}

class GoogleAnalyticsException extends Exception {
    constructor(message: string) {
        super(message);
        this.name = 'Google Analytics';
        createNotification(message);
    }
}

function _Exception(name: string, message: string): void {
    console.groupCollapsed(`${name}`);
    console.info(message);
    console.groupEnd();
    createNotification(message);
}

// function GoogleAnalyticsException(message: string): void {
//     _Exception('GoogleAnalyticsException', message);
// }

function ScheduleException(message: string): void {
    _Exception('ScheduleException', message);
}

function VODException(message: string): void {
    _Exception('VODException', message);
}

function ObserverException(message: string): void {
    _Exception('ObserverException', message);
}

export { GoogleAnalyticsException, ScheduleException, VODException, ObserverException }
