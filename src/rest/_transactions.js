const Router = require('@koa/router');
const transactionService = require('../service/transaction');
const { requireAuthentication } = require('../core/auth');

const getAllTransactions = async (ctx) => {
	ctx.body = await transactionService.getAll();
};

const createTransaction = async (ctx) => {
	const newTransaction = await transactionService.create({
		...ctx.request.body,
		userId: ctx.state.session.userId,
		date: new Date(ctx.request.body.date),
	});
	ctx.body = newTransaction;
};

const getTransactionById = async (ctx) => {
	ctx.body = await transactionService.getById(ctx.params.id);
};

const updateTransaction = async (ctx) => {
	ctx.body = await transactionService.updateById(ctx.params.id, {
		...ctx.request.body,
		date: new Date(ctx.request.body.date),
	});
};

const deleteTransaction = async (ctx) => {
	await transactionService.deleteById(ctx.params.id);
	ctx.status = 204;
};

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
	const router = new Router({
		prefix: '/transactions',
	});

	router.get('/', requireAuthentication, getAllTransactions);
	router.post('/', requireAuthentication, createTransaction);
	router.get('/:id', requireAuthentication, getTransactionById);
	router.put('/:id', requireAuthentication, updateTransaction);
	router.delete('/:id', requireAuthentication, deleteTransaction);

	app.use(router.routes()).use(router.allowedMethods());
};
