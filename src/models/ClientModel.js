const db = require('../helpers/postgres');
const queries = require('./sql/queries');
const crypto = require('crypto');

class ClientModel {
	// Returns a list of clients
	static async getList(search = {}) {
		return db.any(queries.clients.get, search);
	}

	// Returns Client by ID
	static async getOne(clientId) {
		return db.one(queries.clients.getOne, {
			clientId,
		});
	}

	// Create client
	static async createOne(clientData, payloadHash) {
		return db.one(queries.clients.createOne, {
			...clientData,
			payloadHash,
		});
	}

	// Update client
	static async updateOne(clientId, clientData) {
		return db.one(queries.clients.updateOne, {
			formatter: this.formatter(clientData),
			clientId,
		});
	}

	// Delete Client by id
	static async deleteById(clientId) {
		return db.none(queries.clients.deleteOne, {
			clientId,
		});
	}

	// Hash client data
	static hashClient(clientData) {
		return crypto.createHash('sha256').update(JSON.stringify(clientData)).digest('base64');
	}

	//	Dynamically generate update query inputs.
	static formatter(clientData) {
		let query = '';
		Object.keys(clientData).forEach((key) => {
			query += `${key}='${clientData[key]}',`;
		});
		return query.substring(0, query.length - 1);
	}
}

module.exports = ClientModel;