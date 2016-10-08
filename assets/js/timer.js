const INTERVAL = 1;

export default class Timer {

    constructor(onTick) {
        this.interval = undefined;
        this.onTick = onTick;
        this.time = 0;
        this.startTime = 0;
    }

    getTime() {
        // consider adding function that returns time in human-readable format
        return this.time / 1000;
    }

    reset() {
        this.stop();
        this.time = 0;
    }

    start() {
        this.startTime = new Date().getTime();
        this.interval = setInterval(this.tick.bind(this), INTERVAL);
    }

    stop() {
        clearInterval(this.interval);
    }

    tick() {
        this.time = new Date().getTime() - this.startTime;
        if (this.onTick) {
            this.onTick(this.time);
        }
    }
}