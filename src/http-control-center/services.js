


const getInterceptor = async (ctx) => {
  const { tableClient } = ctx.req.requestContext.internal;
  const res = await tableClient.table('interceptor').get(1, cols = []);
  return res;
}

const getEquipmentById = async (tableClient, id) => {
  const res = await tableClient.table('equipment').get(id, cols = []);
  return res;
}

const getAllEquipment = async (tableClient,TableStore) => {
  const res = await tableClient.table('equipment').getRange(TableStore.INF_MIN, TableStore.INF_MAX, cols = [])
  return Object.keys(res).map((key)=> res[key]);
}

const addBarrage = async (ctx) => {
  const { tableClient, TableStore } = ctx.req.requestContext.internal;
  const { fromId, fromName, color, fontSize = '28px', checkStatus = 0, message } = ctx.request.body;
  const currentTime = Date.now().toString();
  const newData = Object.assign({}, { fromId, fromName, color, fontSize, checkStatus: parseInt(checkStatus), message }, { sendTime: currentTime, checkTime: currentTime });
  const res = await tableClient.table('barrage', ['gid', 'id']).put([1, TableStore.PK_AUTO_INCR], newData, c = 'I');
  return res;
}

const updateBarrage = async (ctx) => {
  const { tableClient } = ctx.req.requestContext.internal;
  const { checkStatus } = ctx.request.body;
  const { id } = ctx.request.params;
  const currentTime = Date.now().toString();
  const res = await tableClient.table('barrage', ['gid', 'id']).update([1, parseInt(id)], { checkStatus: parseInt(checkStatus), checkTime: currentTime }, c = 'I')
  return res;
}

const getAllBarrage = async (ctx) => {
  const { tableClient, TableStore } = ctx.req.requestContext.internal;
  const res = await tableClient.table('barrage', ['gid', 'id']).getRange([1, TableStore.INF_MIN], [1, TableStore.INF_MAX], cols = [])
  return res;
}

const getBarrageByCondition = async (ctx) => {
  const { tableClient, TableStore } = ctx.req.requestContext.internal;
  const res = await tableClient.table('barrage').search('index', ['checkStatus', 0])
  return res;
}

const getBarrageById = async (ctx) => {
  const { tableClient } = ctx.req.requestContext.internal;
  const { id } = ctx.request.params;
  const res = await tableClient.table('barrage', ['gid', 'id']).get([1, parseInt(id)], cols = [])
  return res;
}

const updateInterceptor = async (ctx) => {
  const { tableClient } = ctx.req.requestContext.internal;
  const { status = 0, filterWords = '' } = ctx.request.body;
  const res = await tableClient.table('interceptor').put(1, { status: parseInt(status), filterWords }, c = 'I')
  return res;
}

module.exports = {
  addBarrage,
  getBarrageById,
  getAllEquipment,
  getEquipmentById,
  getBarrageByCondition,
  getAllBarrage,
  updateBarrage,
  getInterceptor,
  updateInterceptor
}