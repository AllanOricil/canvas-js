export default class EventEmitter {
    constructor() {
        this.callbacks = {};
    }

    on(event, cb) {
        if (!this.callbacks[event]) this.callbacks[event] = [];
        this.callbacks[event].push(cb);
    }

    emit(event, data) {
        let cbs = this.callbacks[event];
        const promisses = [];

        if (cbs) {
            cbs.forEach(cb => {
                promisses.push(
                    new Promise((resolve, reject) => {
                        cb(data);

                        resolve();
                    })
                );
            });

            Promise.all(promisses);
        }
    }
}