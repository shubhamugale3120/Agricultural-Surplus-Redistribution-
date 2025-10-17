const { EventEmitter } = require("events");

// Central event bus for server-side domain events used by SSE
const bus = new EventEmitter();
bus.setMaxListeners(1000);

function emitEvent(type, payload) {
	bus.emit("event", { type, payload, timestamp: Date.now() });
}

function onEvent(listener) {
	bus.on("event", listener);
	return () => bus.off("event", listener);
}

module.exports = { emitEvent, onEvent };


