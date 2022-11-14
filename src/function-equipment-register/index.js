'use strict';
const SAT = require('./sat');
const endpoint = process.env.endpoint;
const instance = process.env.instance


exports.register = async function (event, context, callback) {
  console.log('event: %s', event);
  const evt = JSON.parse(event);

  const deviceId = evt['headers']['x-ca-deviceid'];
  const docId = evt['queryParameters']['docId'];
  const type = evt['queryParameters']['type'];

  const resp = {
    'isBase64Encoded': 'false',
    'statusCode': '200',
    'body': {
      'deviceId': deviceId,
      'docId': docId,
      'type': type
    },
  };
  try {
    const tableClient = SAT;
    const c = 'I';
    const res = await tableClient.table('equipment', ['id']).put([deviceId], { deviceId, docId, type }, c); //注册用户
    resp.body.res = res;
    callback(null, resp);
  } catch (err) {
    callback(err);
  }

};

exports.initializer = (context, callback) => {
  console.log('initializing'); // 初始化
  const ak = context.credentials.accessKeyId;
  const sk = context.credentials.accessKeySecret;
  const stsToken = context.credentials.securityToken;
  SAT.init(endpoint, instance, ak, sk, stsToken);
  callback(null, '');
};