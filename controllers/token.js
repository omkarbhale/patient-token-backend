const pool = require("../db/pool");
const emitter = require("../events/emitter");

const getAllTokens = async (req, res, next) => {
	pool.query(
		"SELECT * FROM tokens ORDER BY created_at ASC",
		(error, results) => {
			if (error) {
				return res.status(500).json(error);
			}
			res.json(results.rows);
		}
	);
};

const getActiveToken = async (req, res, next) => {
	pool.query("SELECT * FROM tokens WHERE isactive=true", (error, results) => {
		if (error) {
			return res.status(500).json(error);
		}
		res.json(results.rows[0]);
	});
};

const nextToken = async (req, res, next) => {
	const { currentUserId, nextUserId } = req.body;
	const promise1 = new Promise((res, rej) => {
		if (currentUserId == null) {
			return res();
		}
		pool.query(
			"UPDATE tokens SET isactive=false WHERE id=$1",
			[currentUserId],
			(error, results) => {
				if (error) {
					return rej(error);
				}
				res();
			}
		);
	});
	const promise2 = new Promise((res, rej) => {
		pool.query(
			"UPDATE tokens SET isactive=true WHERE id=$1 RETURNING token",
			[nextUserId],
			(error, results) => {
				if (error) {
					return rej(error);
				}
				if (results.rowCount == 0) {
					return rej("Invalid new user id");
				}
				return res(results.rows[0].token);
			}
		);
	});
	try {
		const results = await Promise.all([promise1, promise2]);
		const newToken = results[1];
		console.log(newToken);
		emitter.emit("nexttoken", newToken);
		return res.send(`Token updated to ${nextUserId}`);
	} catch (e) {
		return res.status(500).json(e);
	}
};

const addUser = async (req, res, next) => {
	const { name, phone, token } = req.body;
	pool.query(
		"INSERT INTO tokens (name, phone, token) VALUES ($1, $2, $3) RETURNING *",
		[name, phone, token],
		(error, results) => {
			if (error) {
				return res.status(500).json(error);
			}
			res.status(201).json({
				user: results.rows[0],
			});
		}
	);
};

module.exports = { getAllTokens, getActiveToken, nextToken, addUser };
