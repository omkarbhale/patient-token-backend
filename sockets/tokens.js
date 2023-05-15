const emitter = require("../events/emitter");

module.exports = (io, socket) => {
	emitter.on("nexttoken", (currentToken) => {
		socket.emit("token-update", currentToken);
	});
};
