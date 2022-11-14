const interceptor = {
    id: 'number', //1
    status: 'number', // 0 无检查 1 过滤词 2 管理员审批
    filterWords: 'string' // aa,bbb

}

const barrage = {
    id: 'number',
    fromId: 'number',
    fromName: 'string',
    color: 'string',
    fontSize: 'string',
    checkStatus: 'number', // 0 默认 1 通过 2 拒绝
    sendTime: 'string',
    checkTime: 'string' 
}