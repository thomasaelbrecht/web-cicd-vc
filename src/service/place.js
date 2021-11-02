const config = require('config');
const { getChildLogger } = require('../core/logging');
const placeRepository = require('../repository/place');

const DEFAULT_PAGINATION_LIMIT = config.get('pagination.limit');
const DEFAULT_PAGINATION_OFFSET = config.get('pagination.offset');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('place-service');
	this.logger.debug(message, meta);
};

/**
 * Get all `limit` places, skip the first `offset`.
 *
 * @param {number} [limit] - Nr of places to fetch.
 * @param {number} [offset] - Nr of places to skip.
 */
const getAll = async (
	limit = DEFAULT_PAGINATION_LIMIT,
	offset = DEFAULT_PAGINATION_OFFSET,
) => {
	debugLog('Fetching all places', { limit, offset });
	const data = await placeRepository.findAll({ limit, offset });
	const count = await placeRepository.findCount();
	return { data, count, limit, offset };
};

/**
 * Get the place with the given `id`.
 *
 * @param {string} id - Id of the place to get.
 */
const getById = (id) => {
	debugLog(`Fetching place with id ${id}`);
	return placeRepository.findById(id);
};

/**
 * Create a new place.
 *
 * @param {object} place - Place to create.
 * @param {string} place.name - Name of the place.
 * @param {number} [place.rating] - Rating of the place (between 1 and 5).
 */
const create = ({ name, rating }) => {
	const newPlace = { name, rating };
	debugLog('Creating new place', newPlace);
	return placeRepository.create(newPlace);
};

/**
 * Update an existing place.
 *
 * @param {string} id - Id of the place to update.
 * @param {object} place - Place to save.
 * @param {string} [place.name] - Name of the place.
 * @param {number} [place.rating] - Rating of the place (between 1 and 5).
 */
const updateById = (id, { name, rating }) => {
	const updatedPlace = { name, rating };
	debugLog(`Updating place with id ${id}`, updatedPlace);
	return placeRepository.updateById(id, updatedPlace);
};

/**
 * Delete an existing place.
 *
 * @param {string} id - Id of the place to delete.
 */
const deleteById = async (id) => {
	debugLog(`Deleting place with id ${id}`);
	await placeRepository.deleteById(id);
};

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};
