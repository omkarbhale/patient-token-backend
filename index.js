require("dotenv").config();
const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
	cors: { origin: "http://localhost:3000" },
});

const cors = require("cors");
const bodyParser = require("body-parser");

// middlewares
app.use(
	cors({
		origin: "http://localhost:3000",
	})
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
	res.json({
		info: "Postgresql tutorial",
	});
});

// routes
const tokenRouter = require("./routes/token");
app.use("/tokens", tokenRouter);

// sockets
const registerTokenEvents = require("./sockets/tokens");
io.on("connection", (socket) => {
	registerTokenEvents(io, socket);
	// socket.emit("token-update", "T-101");
	// socket.on("disconnect", () => {});
});

server.listen(3001, () => console.log("listineong on 3001"));
