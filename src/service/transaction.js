const uuid = require('uuid');
const { getChildLogger } = require('../core/logging');
let { TRANSACTIONS } = require('../data/mock-data');
const placeService = require('./place');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('transaction-service');
	this.logger.debug(message, meta);
};

const getAll = () => {
	debugLog('Fetching all transactions');
	return { data: TRANSACTIONS, count: TRANSACTIONS.length };
};

const getById = (id) => {
	debugLog(`Fetching transaction with id ${id}`);
	return TRANSACTIONS.filter((transaction) => transaction.id === id)[0];
};

const create = ({ amount, date, placeId, user }) => {
	if (placeId) {
		const existingPlace = placeService.getById(placeId);

		if (!existingPlace) {
			throw ServiceError.notFound(`There is no place with id ${id}.`, { id });
		}
	}

	if (typeof user === 'string') {
		user = { id: uuid.v4(), name: user };
	}

	const newTransaction = {
		id: uuid.v4(),
		amount,
		date: date.toISOString(),
		place: placeService.getById(placeId),
		user,
	};
	debugLog('Creating new transaction', newTransaction);
	TRANSACTIONS = [...TRANSACTIONS, newTransaction];
	return newTransaction;
};

const updateById = (id, { amount, date, placeId, userId }) => {
	debugLog(`Updating transaction with id ${id}`, {
		amount,
		date,
		placeId,
		userId,
	});

	if (placeId) {
		const existingPlace = placeService.getById(placeId);

		if (!existingPlace) {
			throw ServiceError.notFound(`There is no place with id ${id}.`, { id });
		}
	}
	const index = TRANSACTIONS.findIndex((transaction) => transaction.id === id);

	if (index < 0) return null;

	const transaction = TRANSACTIONS[index];
	transaction.amount = amount;
	transaction.date = date.toISOString();
	transaction.place = placeService.getById(placeId);
	if (userId) {
		transaction.user = userId;
	}

	return transaction;
};

const deleteById = (id) => {
	debugLog(`Deleting transaction with id ${id}`);
	TRANSACTIONS = TRANSACTIONS.filter((transaction) => transaction.id !== id);
};

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};
