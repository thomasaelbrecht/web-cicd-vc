const Joi = require('joi');
const Router = require('@koa/router');

const placeService = require('../service/place');
const { requireAuthentication } = require('../core/auth');

const validate = require('./_validation.js');

const getAllPlaces = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await placeService.getAll(limit, offset);
};
getAllPlaces.validationScheme = {
  query: Joi.object({
    limit: Joi.number().integer().positive().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and('limit', 'offset'),
};

const createPlace = async (ctx) => {
  const newPlace = await placeService.create(ctx.request.body);
  ctx.body = newPlace;
  ctx.status = 201;
};
createPlace.validationScheme = {
  body: {
    name: Joi.string().max(255),
    rating: Joi.number().min(1).max(5).integer().optional(),
  },
};

const getPlaceById = async (ctx) => {
  ctx.body = await placeService.getById(ctx.params.id);
};
getPlaceById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const updatePlace = async (ctx) => {
  ctx.body = await placeService.updateById(ctx.params.id, ctx.request.body);
};
updatePlace.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
    name: Joi.string().max(255),
    rating: Joi.number().min(1).max(5).integer(),
  },
};

const deletePlace = async (ctx) => {
  await placeService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deletePlace.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/places',
  });

  router.get('/', requireAuthentication, validate(getAllPlaces.validationScheme), getAllPlaces);
  router.post('/', requireAuthentication, validate(createPlace.validationScheme), createPlace);
  router.get('/:id', requireAuthentication, validate(getPlaceById.validationScheme), getPlaceById);
  router.put('/:id', requireAuthentication, validate(updatePlace.validationScheme), updatePlace);
  router.delete('/:id', requireAuthentication, validate(deletePlace.validationScheme), deletePlace);

  app.use(router.routes()).use(router.allowedMethods());
};
