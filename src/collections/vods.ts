import { VOD } from "../models/vod";
import { UnMapped } from "./unmapped";
import { config } from "../config";
import { Video } from "../interfaces/video";
import { VODException } from "../exceptions";

class VODs extends UnMapped<VOD> {

    public fetch(): Promise<Array<[string, Video[]]>> {
        return new Promise((resolve, reject) => {
            fetch(config.urls.vod).then((res) => {
                if (res.status !== 200) {
                    reject();
                }

                res.json().then((data) => {
                    resolve(data);
                }).catch(reject);
            }).catch(() => {
                this.retrieve();
            });
        });
    }

    public parse(data: Array<[string, Video[]]>) {
        for (let entry of data['vodStartTimes']) {
            this.storage.push(new VOD(entry));
        }
        this.persist();
    }

    private persist() {
        localStorage.setItem('vod', JSON.stringify([...this.storage]));
    }

    private retrieve() {
        let data = localStorage.getItem('vod');

        if (data == null) {
            throw new VODException("Unable to retrieve VODs from local storage");
        }

        this.storage = JSON.parse(data);
        return this.storage;
    }
}

export { VODs };
