
const path = require('path');
const fs = require('fs');
const YAML = require('yaml');
const DCT_INTEGER = 1;
const DCT_DOUBLE = 2;
const DCT_BOOLEAN = 3;
const DCT_STRING = 4;

async function preInit(inputObj) {

}

async function postInit(inputObj) {

    const s = path.join(inputObj.targetPath, 's.yaml'); // 拿到 access, tablestore endpoint, instanceName
    const _file = fs.readFileSync(s, 'utf8')
    const data = YAML.parse(_file);
    const { access, vars } = data;
    const { endpont, instance } = vars.tablestore;
    const commontData = {
        reservedThroughput: {
            capacityUnit: {
                read: 0,
                write: 0,
            },
        },
        tableOptions: {
            timeToLive: -1, // 数据的过期时间, 单位秒, -1代表永不过期. 假如设置过期时间为一年, 即为 365 * 24 * 3600.
            maxVersions: 1, // 保存的最大版本数, 设置为1即代表每列上最多保存一个版本(保存最新的版本).
        },
        streamSpecification: {
            enableStream: true, //开启Stream
            expirationTime: 24, //Stream的过期时间，单位是小时，最长为168，设置完以后不能修改
        }
    }
    const equipment = {
        tableMeta: {
            tableName: 'equipment',
            primaryKey: [
                {
                    name: 'id',
                    type: 'STRING',
                },
            ],
            definedColumn: [
                {
                    "name": "deviceId",
                    "type": DCT_STRING
                },
                {
                    "name": "docId",
                    "type": DCT_STRING
                },
                {
                    "name": "type",
                    "type": DCT_STRING
                }
            ],
        },

    };
    const barrage = {
        tableMeta: {
            tableName: 'barrage',
            primaryKey: [
                {
                    name: 'gid',
                    type: 'STRING',
                },
                {
                    name: 'id',
                    type: 'INTEGER',
                    option: 'AUTO_INCREMENT'
                },
            ],
            definedColumn: [
                {
                    "name": "fromId",
                    "type": DCT_STRING
                },
                {
                    "name": "fromName",
                    "type": DCT_STRING
                },
                {
                    "name": "color",
                    "type": DCT_STRING
                },
                {
                    "name": "fontSize",
                    "type": DCT_STRING
                },
                {
                    "name": "checkStatus",
                    "type": DCT_INTEGER
                },
                {
                    "name": "sendTime",
                    "type": DCT_STRING
                },
                {
                    "name": "checkTime",
                    "type": DCT_STRING
                },
                {
                    "name": "message",
                    "type": DCT_STRING
                }
            ],
        }
    };
    const interceptor = {
        tableMeta: {
            tableName: 'interceptor',
            primaryKey: [
                {
                    name: 'id',
                    type: 'INTEGER',
                },
            ],
            definedColumn: [
                {
                    "name": "status",
                    "type": DCT_INTEGER
                },
                {
                    "name": "filterWords",
                    "type": DCT_STRING
                }
            ],
        }
    };
    const equipment_params = Object.assign(equipment, commontData);
    const interceptor_params = Object.assign(interceptor, commontData);
    const barrage_params = Object.assign(barrage, commontData);


    const e_shell = `s cli /Users/hanxie/opensource/devsapp/tablestore createTable -a ${access} endpoint ${endpoint} instance ${instance} -p ${JSON.stringify(equipment_params)}`;
    //    const equipment_result = await tableClient.createTable(equipment_params);
    //    const interceptor_result = await tableClient.createTable(interceptor_params);
    //    const barrage_result = await tableClient.createTable(barrage_params);

}

// module.exports = {
//     postInit,
//     preInit
// }


postInit({
    targetPath: '/Users/hanxie/localproject/s-app/barrage2'
})