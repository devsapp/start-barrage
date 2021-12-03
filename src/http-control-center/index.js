
const TableStore = require('tablestore')
const { http } = require('@serverless-devs/dk');
const SAT = require('./sat');
const axios = require('axios');
const endpoint = process.env.endpoint;
const instance = process.env.instance;
const notifyUrl = process.env.notifyUrl;
const { getInterceptor, updateInterceptor, addBarrage, updateBarrage, getBarrageById, getAllBarrage, getBarrageByCondition, getEquipmentById, getAllEquipment } = require('./services');
let internal;


const notify = async function ({ agClient, deviceId, url, from, message, fontSize = '12px', color = '#000' }) {
  try {
    const data = JSON.stringify({
      from,
      message,
      fontSize,
      color
    })
    const r = await axios({
      method: 'post',
      url,
      data,
      timeout: 6000,
      headers: {
        'x-ca-deviceid': deviceId,
      }
    });
    return r.data;
  } catch (err) {
    return err.message;
  }
};
const notifyAdmin = async function ({ agClient, deviceId, url, message, fontSize = '12px', color = '#000', id, fromName }) {
  try {
    const data = JSON.stringify({
      id,
      fromName,
      message,
      fontSize,
      color
    })
    const r = await axios({
      method: 'post',
      url,
      data,
      timeout: 6000,
      headers: {
        'x-ca-deviceid': deviceId,
      }
    })
    return r.data;
  } catch (err) {
    return err.message;
  }
};
http
  .get("/", async (ctx, next) => {
    let result = "Hello ServerlessDevs";
    ctx.body = result;
  })
  .get("/status", async (ctx, next) => {
    try {
      const result = await getInterceptor(ctx);
      ctx.body = result;
    } catch (e) {
      ctx.body = e.message;
    }
  })
  .post("/status", async (ctx, next) => {
    const result = await updateInterceptor(ctx);
    ctx.body = result;
  })
  .post("/send", async (ctx, next) => {
    try {
      const ag = ctx.req.requestContext.ag;
      const { message = '', fromId = '', fromName = "serverlessdevs", color, fontSize = '28px' } = ctx.request.body;
      const { tableClient, TableStore } = ctx.req.requestContext.internal;
      let result = {};
      const equipments = await getAllEquipment(tableClient, TableStore);
      // 查询一下 当前的拦截器状态
      const interceptor = await getInterceptor(ctx);
      if (interceptor.status == 0) {
        // 直接notify 屏幕
        const scressNotifyList = [];
        equipments.filter(equ => equ.type === 'screen').forEach((screen) => {
          scressNotifyList.push(new Promise(async (resolve, reject) => {
            try {
              let r = await notify({ deviceId: screen.deviceId, url: notifyUrl, from: fromName || fromId, message, color, fontSize });
              resolve(r);
            } catch (e) {
              reject(e);
            }
          }));
        })
        result = await Promise.all(scressNotifyList);
      } else {
        const barrageResult = await addBarrage(ctx); // 存储下来
        const [pk1, pk2] = barrageResult.row.primaryKey; // uid, id
        const id = pk2.value.toNumber();
        const adminNotifyList = [];
        equipments.filter(equ => equ.type === 'admin').forEach((admin) => {
          adminNotifyList.push(new Promise(async (resolve, reject) => {
            try {
              let r = await notifyAdmin({ deviceId: admin.deviceId, url: notifyUrl, fromName: fromName || fromId, message, color, fontSize, id });
              resolve(r);
            } catch (e) {
              reject(e);
            }
          }));
        })
        result = await Promise.all(adminNotifyList); // 通知管理后台
      }
      ctx.body = result;
    } catch (e) {
      ctx.body = e.message;
    }
  })
  .get("/barrage", async (ctx, next) => {
    try {
      let result = await getAllBarrage(ctx);
      ctx.body = result;
    } catch (e) {
      ctx.body = e;
    }
  })
  .get("/barrage-search", async (ctx, next) => {
    let result = await getBarrageByCondition(ctx);
    ctx.body = result;
  })
  .get("/barrage/:id", async (ctx, next) => {
    const result = await getBarrageById(ctx);

    ctx.body = result;
  })
  .put("/barrage/:id", async (ctx, next) => {
    try {
      let result = {};
      await updateBarrage(ctx); //最后更新
      const singleBarrage = await getBarrageById(ctx); //查询
      const { checkStatus, fromName, fromId, message, color, fontSize = 28 } = singleBarrage;
      if (checkStatus == 1) {
        // send 弹幕
        const ag = ctx.req.requestContext.ag;
        const { tableClient, TableStore } = ctx.req.requestContext.internal;
        const equipments = await getAllEquipment(tableClient, TableStore);
        const scressNotifyList = [];
        equipments.filter(equ => equ.type === 'screen').forEach((screen) => {
          scressNotifyList.push(new Promise(async (resolve, reject) => {
            try {
              let r = await notify({ deviceId: screen.deviceId, url: notifyUrl, from: fromName || fromId, message, color, fontSize });
              resolve(r);
            } catch (e) {
              reject(e);
            }
          }));
        })
        result = await Promise.all(scressNotifyList);
      }
      ctx.body = result;
    } catch (e) {
      result.body = e.message;
    }
  });

http.app.use(http.routes());

exports.initializer = (context, callback) => {
  try {
    const ak = context.credentials.accessKeyId;
    const sk = context.credentials.accessKeySecret;
    const stsToken = context.credentials.securityToken;
    SAT.init(endpoint, instance, ak, sk, stsToken);
    internal = { tableClient: SAT, TableStore };
    callback();
  } catch (err) {
    callback(err.message);
  }
}

exports.handler = (req, res, context) => {
  context.internal = internal;
  http()(req, res, context);
};

