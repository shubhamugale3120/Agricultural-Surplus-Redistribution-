const express = require("express");
const router = express.Router();
const { onEvent } = require("../utils/eventBus");

// Server-Sent Events stream
router.get("/", (req, res) => {
	res.setHeader("Content-Type", "text/event-stream");
	res.setHeader("Cache-Control", "no-cache");
	res.setHeader("Connection", "keep-alive");
	res.flushHeaders && res.flushHeaders();

	const send = (evt) => {
		res.write(`data: ${JSON.stringify(evt)}\n\n`);
	};

	// Initial ping so clients know we are connected
	send({ type: "connected", payload: { ok: true } });

	const off = onEvent(send);

	req.on("close", () => {
		off();
		try { res.end(); } catch (_) {}
	});
});

module.exports = router;


