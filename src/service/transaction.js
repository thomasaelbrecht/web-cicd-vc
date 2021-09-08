let TRANSACTIONS = [{id: 1, user: 'Benjamin', amount: 100, place: 'Irish Pub', date: '2021-08-15' }];

getAll = () => {
  return TRANSACTIONS;
}

getById = (id) => {  throw new Error("not implemented yet"); }

create = ({amount, date, place, user}) => {
  throw new Error("not implemented yet");
}

updateById = (id, {amount, date, place, user}) => {
  throw new Error("not implemented yet");
}

deleteById = (id) => {
  throw new Error("not implemented yet");
}

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
}
