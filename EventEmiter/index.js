const events = require("events");


class Emitter extends events.EventEmitter{
    constructor() {
        super();
    }
}


const emitter = new Emitter();

module.exports = emitter;