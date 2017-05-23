import { Video } from "../interfaces/video";
import { Model } from "./model";

class VOD extends Model {

    private id: number;
    private startTime: string;

    constructor(data?: Video) {
        super();
        if (data) {
            this.id = data.videoID;
            this.startTime = data.videoStartTime;
        }
    }

}

export { VOD };
