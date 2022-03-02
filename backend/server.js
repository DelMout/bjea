require("dotenv").config();

const app = require("./app");
const http = require("http");

const db = require("./models");

const server = http.createServer(app);

db.sequelize.sync().then((req) => {
	// server.listen();

	server.listen(3001, () => {
		console.log("server running !");
	});
});
