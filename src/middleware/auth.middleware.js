// Middleware Layer
// 📂 src/middleware/ → Functions that run before controllers.
// auth.middleware.js
// Checks if request has a valid token.
// If yes → forward to controller.
// If no → block request with 401 Unauthorized.
// error.middleware.js
// Catches errors globally.
// Ensures clean error responses instead of server crashes.
// 👉 Middleware is like security guards and error handlers.
