module.exports = (err, req, res, next) => {
	const status = err.status || 500;
	const message = err.message || "Internal Server Error";
	if (status >= 500) {
		console.error("[ServerError]", err);
	}
	res.status(status).json({ status: "error", message });
};

// Consistent error responses; log server errors in one place.